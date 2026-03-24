package com.app.service;

import com.app.model.PasswordResetToken;
import com.app.model.User;
import com.app.payload.LoginRequest;
import com.app.repository.UserRepository;
import com.app.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    @Autowired
    com.app.repository.RegistrationTokenRepository registrationTokenRepository;

    @Autowired
    com.app.repository.PasswordResetTokenRepository passwordResetTokenRepository;

    public String authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return tokenProvider.generateToken(authentication);
    }

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public com.app.model.RegistrationToken validateRegistrationToken(String tokenValue) {
        if (tokenValue == null || tokenValue.trim().isEmpty()) {
            return null;
        }

        return registrationTokenRepository.findByToken(tokenValue.trim())
                .filter(token -> !token.getUsed())
                .orElse(null);
    }

    public void markTokenAsUsed(com.app.model.RegistrationToken token, User user) {
        // Delete token after use to keep database clean
        registrationTokenRepository.delete(token);
    }

    // Password Recovery
    public void createPasswordResetTokenForUser(User user, String token) {
        PasswordResetToken myToken = passwordResetTokenRepository.findByUser(user)
                .orElse(new PasswordResetToken());

        // If it's a new token (id is null), we need to set the user
        if (myToken.getId() == null) {
            myToken.setUser(user);
        }

        myToken.setToken(token);
        myToken.setExpiryDate(java.time.LocalDateTime.now().plusMinutes(15));

        passwordResetTokenRepository.save(myToken);
    }

    public com.app.model.PasswordResetToken validatePasswordResetToken(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .filter(t -> t.getExpiryDate().isAfter(java.time.LocalDateTime.now()))
                .orElse(null);
    }

    public void changeUserPassword(User user, String password) {
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    public void deletePasswordResetToken(com.app.model.PasswordResetToken token) {
        passwordResetTokenRepository.delete(token);
    }
}
