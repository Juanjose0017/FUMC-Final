package com.app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "registration_tokens")
@Data
@NoArgsConstructor
public class RegistrationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 36)
    private String token;

    @Column(nullable = false)
    private Boolean used = false;

    @ManyToOne
    @JoinColumn(name = "created_by_user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User createdBy;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime usedAt;

    @ManyToOne
    @JoinColumn(name = "used_by_user_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User usedBy;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.token == null) {
            this.token = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    public void markAsUsed(User user) {
        this.used = true;
        this.usedAt = LocalDateTime.now();
        this.usedBy = user;
    }
}
