package com.app.controller;

import com.app.model.Activity;
import com.app.model.PerformanceForm;
import com.app.service.FormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forms")
@CrossOrigin(origins = "http://localhost:4200")
public class FormController {

    @Autowired
    FormService formService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getForms(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(required = false) String filter) {

        // Get user to check role
        com.app.model.User user = formService.getUserById(userId);

        Page<PerformanceForm> formsPage;
        if ("ADMIN".equals(user.getRole()) || "LIDER".equals(user.getRole())) {
            // Admin and Lider can see all forms
            if ("finished".equals(filter)) {
                formsPage = formService.getCompletedFormsPaginated(page, size);
            } else if ("progress".equals(filter)) {
                formsPage = formService.getInProgressFormsPaginated(page, size);
            } else {
                formsPage = formService.getAllFormsPaginated(page, size);
            }
        } else {
            // Regular users only see their own forms
            if ("finished".equals(filter)) {
                formsPage = formService.getCompletedFormsByUserPaginated(userId, page, size);
            } else if ("progress".equals(filter)) {
                formsPage = formService.getInProgressFormsByUserPaginated(userId, page, size);
            } else {
                formsPage = formService.getFormsByUserPaginated(userId, page, size);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("forms", formsPage.getContent());
        response.put("currentPage", formsPage.getNumber());
        response.put("totalItems", formsPage.getTotalElements());
        response.put("totalPages", formsPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/user/{userId}")
    public ResponseEntity<PerformanceForm> getForm(@PathVariable Long id, @PathVariable Long userId) {
        com.app.model.User user = formService.getUserById(userId);
        if ("ADMIN".equals(user.getRole())) {
            return ResponseEntity.ok(formService.getFormById(id));
        }
        return ResponseEntity.ok(formService.getForm(id, userId));
    }

    @PostMapping
    public PerformanceForm createForm(@RequestBody PerformanceForm form) {
        // In a real app, get user from SecurityContext
        // For now, we assume the frontend sends the user object or ID
        // Or we can fetch it here:
        // String username =
        // SecurityContextHolder.getContext().getAuthentication().getName();
        // User user = userRepository.findByUsername(username).get();
        // form.setUser(user);
        return formService.createForm(form);
    }

    @PutMapping("/{id}/header")
    public PerformanceForm updateHeader(@PathVariable Long id, @RequestBody PerformanceForm form) {
        return formService.updateFormHeader(id, form);
    }

    @PostMapping("/{id}/activities")
    public Activity addActivity(@PathVariable Long id, @RequestBody Activity activity) {
        return formService.addActivity(id, activity);
    }

    @DeleteMapping("/activities/{activityId}")
    public void deleteActivity(@PathVariable Long activityId) {
        formService.deleteActivity(activityId);
    }

    @PutMapping("/activities/{activityId}")
    public Activity updateActivity(@PathVariable Long activityId, @RequestBody Activity activity) {
        return formService.updateActivity(activityId, activity);
    }

    @PostMapping("/{id}/advance")
    public PerformanceForm advancePhase(@PathVariable Long id) {
        return formService.advancePhase(id);
    }

    @PostMapping("/{id}/regress")
    public PerformanceForm regressPhase(@PathVariable Long id) {
        return formService.regressPhase(id);
    }

    @GetMapping("/consolidated")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public List<PerformanceForm> getConsolidatedReports() {
        return formService.getAllForms();
    }

    @GetMapping("/completed")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public List<PerformanceForm> getCompletedForms() {
        return formService.getCompletedForms();
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteForm(@PathVariable Long id) {
        formService.deleteForm(id);
        return ResponseEntity.ok("Formulario eliminado exitosamente");
    }

    // Deleted forms endpoints (Admin only)
    @GetMapping("/deleted")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN') or hasAuthority('LIDER')")
    public ResponseEntity<Map<String, Object>> getDeletedForms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        Page<PerformanceForm> deletedPage = formService.getDeletedFormsPaginated(page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("forms", deletedPage.getContent());
        response.put("currentPage", deletedPage.getNumber());
        response.put("totalItems", deletedPage.getTotalElements());
        response.put("totalPages", deletedPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/restore")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PerformanceForm> restoreForm(@PathVariable Long id) {
        PerformanceForm restored = formService.restoreForm(id);
        return ResponseEntity.ok(restored);
    }

    @DeleteMapping("/{id}/permanent")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> permanentlyDeleteForm(@PathVariable Long id) {
        formService.permanentlyDeleteForm(id);
        return ResponseEntity.ok("Formulario eliminado permanentemente");
    }
}
