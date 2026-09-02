package com.app.service;

import com.app.model.User;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.app.repository.PerformanceFormRepository formRepository;

    @Autowired
    private com.app.repository.RegistrationTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    @Transactional
    public User updateUserRole(Long userId, String newRole) {
        User user = getUserById(userId);
        user.setRole(newRole);
        return userRepository.save(user);
    }

    @Transactional
    public User changeUserPassword(Long userId, String newPassword) {
        if (newPassword == null || newPassword.trim().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }
        User user = getUserById(userId);
        user.setPassword(passwordEncoder.encode(newPassword.trim()));
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long userId, User updatedData) {
        User user = getUserById(userId);

        // Validate username uniqueness
        if (updatedData.getUsername() != null && !updatedData.getUsername().trim().equalsIgnoreCase(user.getUsername())) {
            String newUsername = updatedData.getUsername().trim();
            userRepository.findByUsername(newUsername).ifPresent(existing -> {
                if (!existing.getId().equals(userId)) {
                    throw new IllegalArgumentException("El nombre de usuario '" + newUsername + "' ya está en uso");
                }
            });
            user.setUsername(newUsername);
        }

        // Validate email uniqueness
        if (updatedData.getEmail() != null && !updatedData.getEmail().trim().equalsIgnoreCase(user.getEmail())) {
            String newEmail = updatedData.getEmail().trim();
            userRepository.findByEmail(newEmail).ifPresent(existing -> {
                if (!existing.getId().equals(userId)) {
                    throw new IllegalArgumentException("El correo electrónico '" + newEmail + "' ya está registrado");
                }
            });
            user.setEmail(newEmail);
        }

        // Validate cedula uniqueness
        if (updatedData.getCedula() != null && !updatedData.getCedula().trim().equals(user.getCedula())) {
            String newCedula = updatedData.getCedula().trim();
            userRepository.findByCedula(newCedula).ifPresent(existing -> {
                if (!existing.getId().equals(userId)) {
                    throw new IllegalArgumentException("La cédula '" + newCedula + "' ya está registrada");
                }
            });
            user.setCedula(newCedula);
        }

        if (updatedData.getFirstName() != null && !updatedData.getFirstName().trim().isEmpty()) {
            user.setFirstName(updatedData.getFirstName().trim());
        }
        user.setSecondName(updatedData.getSecondName() != null ? updatedData.getSecondName().trim() : null);
        if (updatedData.getFirstLastName() != null && !updatedData.getFirstLastName().trim().isEmpty()) {
            user.setFirstLastName(updatedData.getFirstLastName().trim());
        }
        if (updatedData.getSecondLastName() != null && !updatedData.getSecondLastName().trim().isEmpty()) {
            user.setSecondLastName(updatedData.getSecondLastName().trim());
        }
        if (updatedData.getRole() != null && !updatedData.getRole().trim().isEmpty()) {
            user.setRole(updatedData.getRole().trim().toUpperCase());
        }

        return userRepository.save(user);
    }

    @Transactional
    public User changeMyPassword(String username, String currentPassword, String newPassword) {
        if (newPassword == null || newPassword.trim().length() < 6) {
            throw new IllegalArgumentException("La nueva contraseña debe tener al menos 6 caracteres");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        user.setPassword(passwordEncoder.encode(newPassword.trim()));
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        User user = getUserById(userId);

        // Delete all performance forms created by this user
        formRepository.deleteByUser(user);

        // Nullify or delete registration tokens created by this user
        tokenRepository.findAll().forEach(token -> {
            if (token.getCreatedBy() != null && token.getCreatedBy().getId().equals(userId)) {
                token.setCreatedBy(null);
                tokenRepository.save(token);
            }
            if (token.getUsedBy() != null && token.getUsedBy().getId().equals(userId)) {
                token.setUsedBy(null);
                tokenRepository.save(token);
            }
        });

        // Now delete the user
        userRepository.deleteById(userId);
    }
}
