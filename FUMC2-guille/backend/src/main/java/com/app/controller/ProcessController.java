package com.app.controller;

import com.app.model.Process;
import com.app.service.ProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/processes")
@CrossOrigin(origins = "http://localhost:4200")
public class ProcessController {

    @Autowired
    private ProcessService processService;

    @GetMapping
    public ResponseEntity<List<Process>> getAllProcesses() {
        return ResponseEntity.ok(processService.getAllProcesses());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Process>> getActiveProcesses() {
        return ResponseEntity.ok(processService.getActiveProcesses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Process> getProcessById(@PathVariable Long id) {
        return processService.getProcessById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> createProcess(@RequestBody Process process) {
        try {
            Process created = processService.createProcess(process);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateProcess(@PathVariable Long id, @RequestBody Process process) {
        try {
            Process updated = processService.updateProcess(id, process);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteProcess(@PathVariable Long id) {
        try {
            processService.deleteProcess(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
