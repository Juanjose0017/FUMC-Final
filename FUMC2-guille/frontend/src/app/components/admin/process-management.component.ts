import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcessService, Process } from '../../services/process.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-process-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './process-management.component.html',
  styleUrls: ['./process-management.component.css']
})
export class ProcessManagementComponent implements OnInit {
    processes: Process[] = [];
    showModal = false;
    isEditMode = false;
    currentProcess: Process = { name: '', description: '', active: true };

    constructor(
      private processService: ProcessService,
      private notify: NotificationService
    ) { }

    ngOnInit() {
        this.loadProcesses();
    }

    loadProcesses() {
        this.processService.getAllProcesses().subscribe({
            next: (data) => this.processes = data,
            error: (err) => console.error('Error loading processes:', err)
        });
    }

    openAddModal() {
        this.isEditMode = false;
        this.currentProcess = { name: '', description: '', active: true };
        this.showModal = true;
    }

    openEditModal(process: Process) {
        this.isEditMode = true;
        this.currentProcess = { ...process };
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
    }

    saveProcess() {
        if (!this.currentProcess.name || this.currentProcess.name.trim() === '') {
            this.notify.showToast('warning', 'Validación', 'El nombre del proceso es requerido');
            return;
        }

        if (this.isEditMode && this.currentProcess.id) {
            this.processService.updateProcess(this.currentProcess.id, this.currentProcess).subscribe({
                next: () => {
                    this.notify.showToast('success', 'Proceso actualizado', 'El proceso se actualizó correctamente');
                    this.loadProcesses();
                    this.closeModal();
                },
                error: (err) => this.notify.showToast('error', 'Error', 'Error al actualizar: ' + (err.error || err.message))
            });
        } else {
            this.processService.createProcess(this.currentProcess).subscribe({
                next: () => {
                    this.notify.showToast('success', 'Proceso creado', 'El proceso se creó correctamente');
                    this.loadProcesses();
                    this.closeModal();
                },
                error: (err) => this.notify.showToast('error', 'Error', 'Error al crear: ' + (err.error || err.message))
            });
        }
    }

    confirmDelete(process: Process) {
        this.notify.showConfirm(
            '¿Eliminar proceso?',
            `¿Está seguro de eliminar el proceso "${process.name}"?`,
            'danger',
            'Eliminar',
            () => {
                this.processService.deleteProcess(process.id!).subscribe({
                    next: () => {
                        this.notify.showToast('success', 'Proceso eliminado', 'El proceso fue eliminado exitosamente');
                        this.loadProcesses();
                    },
                    error: (err) => this.notify.showToast('error', 'Error', 'Error al eliminar: ' + (err.error || err.message))
                });
            }
        );
    }
}
