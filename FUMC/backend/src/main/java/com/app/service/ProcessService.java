package com.app.service;

import com.app.model.Process;
import com.app.repository.ProcessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProcessService {

    @Autowired
    private ProcessRepository processRepository;

    public List<Process> getAllProcesses() {
        return processRepository.findAll();
    }

    public List<Process> getActiveProcesses() {
        return processRepository.findByActiveTrue();
    }

    public Optional<Process> getProcessById(Long id) {
        return processRepository.findById(id);
    }

    public Process createProcess(Process process) {
        // Check if name already exists
        Optional<Process> existing = processRepository.findByName(process.getName());
        if (existing.isPresent()) {
            throw new RuntimeException("Process with name '" + process.getName() + "' already exists");
        }
        return processRepository.save(process);
    }

    public Process updateProcess(Long id, Process processDetails) {
        Process process = processRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Process not found with id: " + id));

        // Check if new name conflicts with another process
        if (!process.getName().equals(processDetails.getName())) {
            Optional<Process> existing = processRepository.findByName(processDetails.getName());
            if (existing.isPresent() && !existing.get().getId().equals(id)) {
                throw new RuntimeException("Process with name '" + processDetails.getName() + "' already exists");
            }
        }

        process.setName(processDetails.getName());
        process.setDescription(processDetails.getDescription());
        process.setActive(processDetails.getActive());

        return processRepository.save(process);
    }

    public void deleteProcess(Long id) {
        Process process = processRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Process not found with id: " + id));

        // Soft delete
        process.setActive(false);
        processRepository.save(process);
    }
}
