package com.app.controller;

import com.app.model.RegistrationToken;
import com.app.model.User;
import com.app.payload.TokenResponse;
import com.app.repository.RegistrationTokenRepository;
import com.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/tokens")
@CrossOrigin(origins = "http://192.168.1.81:4200")
@PreAuthorize("hasAuthority('ADMIN')")
public class RegistrationTokenController {

    @Autowired
    private RegistrationTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/generate")
    public ResponseEntity<?> generateToken(Authentication authentication) {
        String username = authentication.getName();
        User admin = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RegistrationToken token = new RegistrationToken();
        token.setCreatedBy(admin);
        token = tokenRepository.save(token);

        Map<String, Object> response = new HashMap<>();
        response.put("id", token.getId());
        response.put("token", token.getToken());
        response.put("createdAt", token.getCreatedAt());
        response.put("createdByUsername", admin.getUsername());

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TokenResponse>> getAllTokens() {
        List<RegistrationToken> tokens = tokenRepository.findAllByOrderByCreatedAtDesc();
        List<TokenResponse> response = tokens.stream()
                .map(token -> new TokenResponse(
                        token.getId(),
                        token.getToken(),
                        token.getUsed(),
                        token.getCreatedBy() != null ? token.getCreatedBy().getUsername() : null,
                        token.getCreatedAt(),
                        token.getUsedAt(),
                        token.getUsedBy() != null ? token.getUsedBy().getUsername() : null))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteToken(@PathVariable Long id) {
        RegistrationToken token = tokenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Token no encontrado"));

        if (token.getUsed()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "No se pudo eliminar el token porque ya fue usado");
            return ResponseEntity.badRequest().body(error);
        }

        tokenRepository.delete(token);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Token eliminado exitosamente");
        return ResponseEntity.ok().body(response);
    }
}
