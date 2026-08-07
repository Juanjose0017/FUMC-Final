package com.app.repository;

import com.app.model.RegistrationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationTokenRepository extends JpaRepository<RegistrationToken, Long> {
    Optional<RegistrationToken> findByToken(String token);

    List<RegistrationToken> findByUsedFalse();

    List<RegistrationToken> findAllByOrderByCreatedAtDesc();
}
