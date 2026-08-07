package com.app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "form_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private PerformanceForm form;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String type; // ESTRATEGICA, MISIONAL, APOYO

    @Column(nullable = false)
    private String activityType = "LABORAL"; // LABORAL, EXTRALABORAL

    // Phase 2: Frequency
    private String frequency;

    // Phase 3: Priority (0-100)
    private Double importance; // 50%
    private Double coherence;  // 30%
    private Double relevance;  // 20%
    private Double priorityScore; // Calculated

    // Phase 4: Time
    private Double timeValue;
    private String timeUnit; // "DIA", "SEMANA", "QUINCENA", "MES", "TRIMESTRE", "SEMESTRE", "ANIO"
    private Double calculatedAnnualTime; // Calculated
}
