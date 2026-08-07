package com.app.payload;

import lombok.Data;

@Data
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String role;
    private String fullName;

    public AuthResponse(String accessToken, Long userId, String role, String fullName) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.role = role;
        this.fullName = fullName;
    }
}
