package com.app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

    @Column(nullable = false)
    private String firstName;

    private String secondName;

    @Column(nullable = false)
    private String firstLastName;

    @Column(nullable = false)
    private String secondLastName;

    @Column(unique = true, nullable = false)
    private String cedula;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String role; // "USER", "ADMIN"
}
