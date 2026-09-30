package com.app.controller;

import com.app.model.User;
import com.app.payload.AuthResponse;
import com.app.payload.LoginRequest;
import com.app.repository.UserRepository;
import com.app.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    com.app.repository.PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    com.app.service.EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        String jwt = authService.authenticateUser(loginRequest);
        User user = userRepository.findByUsername(loginRequest.getUsername()).get();
        String fullName = user.getFirstName() + " " +
                (user.getSecondName() != null ? user.getSecondName() + " " : "") +
                user.getFirstLastName() + " " + user.getSecondLastName();
        return ResponseEntity.ok(new AuthResponse(jwt, user.getId(), user.getRole(), fullName.trim()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody com.app.payload.RegisterRequest registerRequest) {
        // Validate registration token
        if (registerRequest.getRegistrationToken() == null || registerRequest.getRegistrationToken().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Se requiere un código de registro válido");
        }

        com.app.model.RegistrationToken token = authService
                .validateRegistrationToken(registerRequest.getRegistrationToken());
        if (token == null) {
            return ResponseEntity.badRequest().body("Código de registro inválido o ya utilizado");
        }

        // Generate username: firstName.firstLastName{last4DigitsOfCedula}
        String last4Digits = registerRequest.getCedula().length() >= 4
                ? registerRequest.getCedula().substring(registerRequest.getCedula().length() - 4)
                : registerRequest.getCedula();
        String generatedUsername = (registerRequest.getFirstName() + "." +
                registerRequest.getFirstLastName() +
                last4Digits).toLowerCase();

        // Check if username already exists and append number if needed
        String finalUsername = generatedUsername;
        int suffix = 1;
        while (userRepository.existsByUsername(finalUsername)) {
            finalUsername = generatedUsername + suffix;
            suffix++;
        }
        generatedUsername = finalUsername;

        // Check if cedula already exists
        if (userRepository.existsByCedula(registerRequest.getCedula())) {
            return ResponseEntity.badRequest().body("¡La cédula ya está registrada!");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("¡El email ya está registrado!");
        }

        // Create new user
        User user = new User();
        user.setUsername(generatedUsername);
        user.setFirstName(registerRequest.getFirstName());
        user.setSecondName(registerRequest.getSecondName());
        user.setFirstLastName(registerRequest.getFirstLastName());
        user.setSecondLastName(registerRequest.getSecondLastName());
        user.setCedula(registerRequest.getCedula());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());

        // Default role to USER if not specified
        if (registerRequest.getRole() == null || registerRequest.getRole().isEmpty()) {
            user.setRole("USER");
        } else {
            user.setRole(registerRequest.getRole());
        }

        User result = authService.registerUser(user);

        // Mark token as used
        authService.markTokenAsUsed(token, result);

        // Return the generated username
        return ResponseEntity.ok(new java.util.HashMap<String, Object>() {
            {
                put("message", "Usuario registrado exitosamente");
                put("username", result.getUsername());
                put("id", result.getId());
            }
        });
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody java.util.Map<String, String> request) {
        // Frontend sends "contact" but now it is the "username"
        String username = request.get("contact");
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Ingrese su usuario");
        }

        java.util.Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            // For security, detailed messages might be bad, but for usability here:
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        User user = userOpt.get();

        // Generate 6 digit code
        String token = String.format("%06d", new java.util.Random().nextInt(999999));

        // Save token
        authService.createPasswordResetTokenForUser(user, token);

        // Send email
        String subject = "Código de recuperación de contraseña";
        String body = "Su código de recuperación de contraseña es: " + token + "\n\nEste código expirará en 24 horas.";

        try {
            emailService.sendSimpleMessage(user.getEmail(), subject, body);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al enviar el correo: " + e.getMessage());
        }

        return ResponseEntity.ok(new java.util.HashMap<String, String>() {
            {
                put("message",
                        "Si el usuario existe, se ha enviado un código a su correo registrado: " + user.getEmail());
            }
        });
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String code = request.get("code");
        String newPassword = request.get("newPassword");

        if (code == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Faltan datos");
        }

        com.app.model.PasswordResetToken token = authService.validatePasswordResetToken(code);
        if (token == null) {
            return ResponseEntity.badRequest().body("Código inválido o expirado");
        }

        User user = token.getUser();
        authService.changeUserPassword(user, newPassword);
        authService.deletePasswordResetToken(token);

        return ResponseEntity.ok(new java.util.HashMap<String, String>() {
            {
                put("message", "Contraseña actualizada exitosamente");
            }
        });
    }
}
