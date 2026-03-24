package com.app.repository;

import com.app.model.PerformanceForm;
import com.app.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface PerformanceFormRepository extends JpaRepository<PerformanceForm, Long> {
    // Paginated queries for non-deleted forms
    Page<PerformanceForm> findByUserIdAndDeletedFalse(Long userId, Pageable pageable);

    // Non-paginated queries for non-deleted forms
    List<PerformanceForm> findByUserIdAndDeletedFalse(Long userId);

    // Find all non-deleted forms
    Page<PerformanceForm> findByDeletedFalse(Pageable pageable);

    List<PerformanceForm> findByDeletedFalse();

    // Find by phase and deleted status
    Page<PerformanceForm> findByDeletedFalseAndCurrentPhaseLessThan(int phase, Pageable pageable);

    Page<PerformanceForm> findByDeletedFalseAndCurrentPhase(int phase, Pageable pageable);

    Page<PerformanceForm> findByUserIdAndDeletedFalseAndCurrentPhaseLessThan(Long userId, int phase, Pageable pageable);

    Page<PerformanceForm> findByUserIdAndDeletedFalseAndCurrentPhase(Long userId, int phase, Pageable pageable);

    // Find deleted forms (for admin)
    Page<PerformanceForm> findByDeletedTrue(Pageable pageable);

    List<PerformanceForm> findByDeletedTrue();

    Optional<PerformanceForm> findByIdAndUserId(Long id, Long userId);

    @Modifying
    @Transactional
    void deleteByUser(User user);
}
