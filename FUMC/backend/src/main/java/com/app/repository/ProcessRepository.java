package com.app.repository;

import com.app.model.Process;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProcessRepository extends JpaRepository<Process, Long> {

    List<Process> findByActiveTrue();

    Optional<Process> findByName(String name);
}
