package com.app.service;

import com.app.model.User;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateUserRole(Long userId, String newRole) {
        User user = getUserById(userId);
        user.setRole(newRole);
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
        // Set createdBy to null for tokens created by this user
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
