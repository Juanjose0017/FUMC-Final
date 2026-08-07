package com.app.service;

import com.app.model.Activity;
import com.app.model.PerformanceForm;
import com.app.repository.ActivityRepository;
import com.app.repository.PerformanceFormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class FormService {

    @Autowired
    PerformanceFormRepository formRepository;

    @Autowired
    ActivityRepository activityRepository;

    @Autowired
    com.app.repository.UserRepository userRepository;

    public com.app.model.User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Non-deleted forms - paginated
    public Page<PerformanceForm> getFormsByUserPaginated(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return formRepository.findByUserIdAndDeletedFalse(userId, pageable);
    }

    public List<PerformanceForm> getFormsByUser(Long userId) {
        return formRepository.findByUserIdAndDeletedFalse(userId);
    }

    public Page<PerformanceForm> getAllFormsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return formRepository.findByDeletedFalse(pageable);
    }

    public List<PerformanceForm> getAllForms() {
        return formRepository.findByDeletedFalse();
    }

    public Page<PerformanceForm> getCompletedFormsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return formRepository.findByDeletedFalseAndCurrentPhase(5, pageable);
    }

    public Page<PerformanceForm> getInProgressFormsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return formRepository.findByDeletedFalseAndCurrentPhaseLessThan(5, pageable);
    }

    public Page<PerformanceForm> getCompletedFormsByUserPaginated(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return formRepository.findByUserIdAndDeletedFalseAndCurrentPhase(userId, 5, pageable);
    }

    public Page<PerformanceForm> getInProgressFormsByUserPaginated(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return formRepository.findByUserIdAndDeletedFalseAndCurrentPhaseLessThan(userId, 5, pageable);
    }

    public List<PerformanceForm> getCompletedForms() {
        return formRepository.findByDeletedFalse().stream()
                .filter(form -> form.getCurrentPhase() == 5)
                .collect(java.util.stream.Collectors.toList());
    }

    // Deleted forms management
    public Page<PerformanceForm> getDeletedFormsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("deletedAt").descending());
        return formRepository.findByDeletedTrue(pageable);
    }

    public List<PerformanceForm> getDeletedForms() {
        return formRepository.findByDeletedTrue();
    }

    public PerformanceForm getForm(Long id, Long userId) {
        return formRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Form not found"));
    }

    public PerformanceForm getFormById(Long id) {
        return formRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form not found"));
    }

    public PerformanceForm createForm(PerformanceForm form) {
        form.setCurrentPhase(1);
        form.setDeleted(false);
        return formRepository.save(form);
    }

    @Transactional
    public PerformanceForm updateFormHeader(Long formId, PerformanceForm formDetails) {
        PerformanceForm form = formRepository.findById(formId).orElseThrow();
        if (form.getCurrentPhase() != 1) {
            throw new RuntimeException("Headers can only be edited in Phase 1");
        }
        form.setEmpresa(formDetails.getEmpresa());
        form.setArea(formDetails.getArea());
        form.setProceso(formDetails.getProceso());
        form.setCargo(formDetails.getCargo());
        form.setLider(formDetails.getLider());
        form.setFechaInicio(formDetails.getFechaInicio());
        form.setFechaFin(formDetails.getFechaFin());

        // New fields
        form.setWeeklyWorkHours(formDetails.getWeeklyWorkHours());
        form.setWeeklyExtraHours(formDetails.getWeeklyExtraHours());
        form.setWorkSchedule(formDetails.getWorkSchedule());

        return formRepository.save(form);
    }

    @Transactional
    public Activity addActivity(Long formId, Activity activity) {
        PerformanceForm form = formRepository.findById(formId).orElseThrow();
        if (form.getCurrentPhase() > 2) {
            throw new RuntimeException("Cannot add activities after Phase 2");
        }

        // Code for limit checks removed because the frontend now handles exceeding
        // limits with warnings

        activity.setForm(form);
        return activityRepository.save(activity);
    }

    @Transactional
    public void deleteActivity(Long activityId) {
        Activity activity = activityRepository.findById(activityId).orElseThrow();
        if (activity.getForm().getCurrentPhase() > 2) {
            throw new RuntimeException("Cannot delete activities after Phase 2");
        }
        activityRepository.delete(activity);
    }

    @Transactional
    public Activity updateActivity(Long activityId, Activity activityDetails) {
        Activity activity = activityRepository.findById(activityId).orElseThrow();
        int phase = activity.getForm().getCurrentPhase();

        if (phase == 1) {
            activity.setDescription(activityDetails.getDescription());
            activity.setType(activityDetails.getType());
            // This line was missing, preventing any movement between Laboral and
            // Extralaboral lists!
            activity.setActivityType(activityDetails.getActivityType());
        } else if (phase == 2) {
            // Phase 2: Frequency and Time Unit
            activity.setFrequency(activityDetails.getFrequency());
            activity.setTimeUnit(activityDetails.getTimeUnit());
        } else if (phase == 3) {
            // Phase 3: Priorities
            activity.setImportance(activityDetails.getImportance());
            activity.setCoherence(activityDetails.getCoherence());
            activity.setRelevance(activityDetails.getRelevance());
            calculatePriority(activity);
        } else if (phase == 4) {
            // Phase 4: Time
            activity.setTimeValue(activityDetails.getTimeValue());
            activity.setTimeUnit(activityDetails.getTimeUnit());
            calculateTime(activity);
        }

        return activityRepository.save(activity);
    }

    private void calculatePriority(Activity activity) {
        if (activity.getImportance() != null && activity.getCoherence() != null && activity.getRelevance() != null) {
            double score = (activity.getImportance() * 0.50) +
                    (activity.getCoherence() * 0.30) +
                    (activity.getRelevance() * 0.20);
            activity.setPriorityScore(score);
        }
    }

    private void calculateTime(Activity activity) {
        if (activity.getTimeValue() != null && activity.getTimeUnit() != null) {
            double factor = 0;
            switch (activity.getTimeUnit().toUpperCase()) {
                case "DIA":
                    factor = 5 * 4.3 * 12;
                    break; // Assuming 5 days/week
                case "SEMANA":
                    factor = 4.3 * 12;
                    break;
                case "QUINCENA":
                    factor = 2 * 12;
                    break;
                case "MES":
                    factor = 12;
                    break;
                case "TRIMESTRE":
                    factor = 4;
                    break;
                case "SEMESTRE":
                    factor = 2;
                    break;
                case "AÑO":
                    factor = 1;
                    break;
            }
            activity.setCalculatedAnnualTime(activity.getTimeValue() * factor);
        }
    }

    public PerformanceForm advancePhase(Long formId) {
        PerformanceForm form = formRepository.findById(formId).orElseThrow();
        if (form.getCurrentPhase() < 5) {
            form.setCurrentPhase(form.getCurrentPhase() + 1);
        }
        return formRepository.save(form);
    }

    public PerformanceForm regressPhase(Long formId) {
        PerformanceForm form = formRepository.findById(formId).orElseThrow();
        // Only allow going back to Phase 1 from Phase 2 to add activities
        // After Phase 2, cannot go back
        if (form.getCurrentPhase() == 2) {
            form.setCurrentPhase(1);
            return formRepository.save(form);
        }
        throw new RuntimeException("No se puede retroceder desde esta fase");
    }

    public PerformanceForm unlockForm(Long formId) {
        PerformanceForm form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));
        form.setCurrentPhase(1);
        return formRepository.save(form);
    }

    // Soft delete - mark as deleted instead of removing
    @Transactional
    public void deleteForm(Long formId) {
        PerformanceForm form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));
        form.setDeleted(true);
        form.setDeletedAt(LocalDate.now());
        formRepository.save(form);
    }

    // Restore deleted form
    @Transactional
    public PerformanceForm restoreForm(Long formId) {
        PerformanceForm form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));
        if (form.getDeleted() != null && !form.getDeleted()) {
            throw new RuntimeException("Form is not deleted");
        }
        form.setDeleted(false);
        form.setDeletedAt(null);
        return formRepository.save(form);
    }

    // Permanent delete (only for admin)
    @Transactional
    public void permanentlyDeleteForm(Long formId) {
        if (!formRepository.existsById(formId)) {
            throw new RuntimeException("Form not found");
        }
        formRepository.deleteById(formId);
    }
}
