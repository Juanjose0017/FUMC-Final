package com.app.payload;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String secondName;
    private String firstLastName;
    private String secondLastName;
    private String cedula;
    private String email;
    private String password;
    private String role; // Optional, defaults to USER
    private String registrationToken; // Required for registration
}
