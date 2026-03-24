package com.app.payload;

import java.time.LocalDateTime;

public class TokenResponse {
    private Long id;
    private String token;
    private Boolean used;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime usedAt;
    private String usedByUsername;

    public TokenResponse(Long id, String token, Boolean used, String createdByUsername,
            LocalDateTime createdAt, LocalDateTime usedAt, String usedByUsername) {
        this.id = id;
        this.token = token;
        this.used = used;
        this.createdByUsername = createdByUsername;
        this.createdAt = createdAt;
        this.usedAt = usedAt;
        this.usedByUsername = usedByUsername;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Boolean getUsed() {
        return used;
    }

    public void setUsed(Boolean used) {
        this.used = used;
    }

    public String getCreatedByUsername() {
        return createdByUsername;
    }

    public void setCreatedByUsername(String createdByUsername) {
        this.createdByUsername = createdByUsername;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUsedAt() {
        return usedAt;
    }

    public void setUsedAt(LocalDateTime usedAt) {
        this.usedAt = usedAt;
    }

    public String getUsedByUsername() {
        return usedByUsername;
    }

    public void setUsedByUsername(String usedByUsername) {
        this.usedByUsername = usedByUsername;
    }
}
