package com.app.controller;

import com.app.model.User;
import com.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN') or hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User updated = userService.updateUser(id, user);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error al actualizar usuario: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN') or hasRole('ADMIN')")
    public User updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newRole = payload.get("role");
        return userService.updateUserRole(id, newRole);
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<?> changeUserPasswordByAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String newPassword = payload.get("newPassword");
        if (newPassword == null || newPassword.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "La nueva contraseña es requerida");
            return ResponseEntity.badRequest().body(error);
        }
        try {
            User updated = userService.changeUserPassword(id, newPassword);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Contraseña actualizada exitosamente");
            response.put("username", updated.getUsername());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error al cambiar contraseña: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/profile/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changeMyPassword(
            Authentication authentication,
            @RequestBody Map<String, String> payload) {
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        if (currentPassword == null || currentPassword.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "La contraseña actual es requerida");
            return ResponseEntity.badRequest().body(error);
        }

        if (newPassword == null || newPassword.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "La nueva contraseña es requerida");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            userService.changeMyPassword(authentication.getName(), currentPassword, newPassword);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tu contraseña ha sido actualizada exitosamente");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error al actualizar contraseña: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'ROLE_ADMIN') or hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
