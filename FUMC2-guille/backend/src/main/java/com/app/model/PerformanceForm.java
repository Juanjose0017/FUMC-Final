package com.app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "performance_forms")
@Data
@NoArgsConstructor
public class PerformanceForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private int year;

    @Column(nullable = false)
    private int currentPhase = 1; // 1 to 5

    // Header Info (Immutable after Phase 1)
    private String empresa;
    private String area;
    private String proceso;
    private String cargo;
    private String lider;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;

    // New fields
    private Integer weeklyWorkHours;
    private Integer weeklyExtraHours;
    private String workSchedule; // "Lunes a Viernes", "Lunes a Sábado", "7/24"

    // Soft delete fields
    @Column(name = "deleted", columnDefinition = "boolean default false")
    private Boolean deleted = false;

    private LocalDate deletedAt;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Activity> activities;
}
