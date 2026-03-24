import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcessService, Process } from '../../services/process.service';

@Component({
    selector: 'app-process-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="process-management">
      <div class="header">
        <h2>Gestión de Procesos</h2>
        <button (click)="openAddModal()" class="btn btn-primary">+ Nuevo Proceso</button>
      </div>

      <div class="table-container">
        <table class="process-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let process of processes">
              <td>{{ process.name }}</td>
              <td>{{ process.description || 'N/A' }}</td>
              <td>
                <span class="badge" [class.active]="process.active" [class.inactive]="!process.active">
                  {{ process.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>{{ process.createdAt | date:'dd/MM/yyyy' }}</td>
              <td class="actions">
                <button (click)="openEditModal(process)" class="btn-icon" title="Editar">✏️</button>
                <button (click)="confirmDelete(process)" class="btn-icon" title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="processes.length === 0" class="empty-state">
          No hay procesos registrados
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Editar Proceso' : 'Nuevo Proceso' }}</h3>
            <button (click)="closeModal()" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Nombre *</label>
              <input type="text" [(ngModel)]="currentProcess.name" class="form-control" placeholder="Ej: Recursos Humanos">
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea [(ngModel)]="currentProcess.description" class="form-control" rows="3" placeholder="Descripción del proceso"></textarea>
            </div>
            <div class="form-group" *ngIf="isEditMode">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="currentProcess.active">
                Activo
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Cancelar</button>
            <button (click)="saveProcess()" class="btn btn-primary">{{ isEditMode ? 'Actualizar' : 'Crear' }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .process-management { padding: 2rem; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header h2 { margin: 0; color: var(--fumc-blue-dark); }
    
    .table-container { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .process-table { width: 100%; border-collapse: collapse; }
    .process-table th { text-align: left; padding: 1rem; border-bottom: 2px solid #e5e7eb; color: var(--fumc-blue-dark); font-weight: 600; }
    .process-table td { padding: 1rem; border-bottom: 1px solid #e5e7eb; }
    .process-table tbody tr:hover { background: #f9fafb; }
    
    .badge { padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 500; }
    .badge.active { background: #d1fae5; color: #065f46; }
    .badge.inactive { background: #fee2e2; color: #991b1b; }
    
    .actions { display: flex; gap: 0.5rem; }
    .btn-icon { background: none; border: none; font-size: 1.25rem; cursor: pointer; padding: 0.25rem; transition: transform 0.2s; }
    .btn-icon:hover { transform: scale(1.2); }
    
    .empty-state { text-align: center; padding: 3rem; color: var(--text-secondary); }
    
    .btn { padding: 0.6rem 1.2rem; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: var(--fumc-blue); color: white; }
    .btn-primary:hover { background: var(--fumc-blue-dark); }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-secondary:hover { background: #5a6268; }
    
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; }
    .modal-content { background: white; border-radius: 12px; width: 90%; max-width: 500px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
    .modal-header { padding: 1.5rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
    .modal-header h3 { margin: 0; color: var(--fumc-blue-dark); }
    .close-btn { background: none; border: none; font-size: 2rem; color: #6c757d; cursor: pointer; line-height: 1; }
    .modal-body { padding: 1.5rem; }
    .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb; display: flex; gap: 0.75rem; justify-content: flex-end; }
    
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--fumc-gray-dark); }
    .form-control { width: 100%; padding: 0.6rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
    .form-control:focus { outline: none; border-color: var(--fumc-blue); }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .checkbox-label input[type="checkbox"] { width: auto; }
  `]
})
export class ProcessManagementComponent implements OnInit {
    processes: Process[] = [];
    showModal = false;
    isEditMode = false;
    currentProcess: Process = { name: '', description: '', active: true };

    constructor(private processService: ProcessService) { }

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
            alert('El nombre del proceso es requerido');
            return;
        }

        if (this.isEditMode && this.currentProcess.id) {
            this.processService.updateProcess(this.currentProcess.id, this.currentProcess).subscribe({
                next: () => {
                    this.loadProcesses();
                    this.closeModal();
                },
                error: (err) => alert('Error al actualizar: ' + (err.error || err.message))
            });
        } else {
            this.processService.createProcess(this.currentProcess).subscribe({
                next: () => {
                    this.loadProcesses();
                    this.closeModal();
                },
                error: (err) => alert('Error al crear: ' + (err.error || err.message))
            });
        }
    }

    confirmDelete(process: Process) {
        if (confirm(`¿Está seguro de eliminar el proceso "${process.name}"?`)) {
            this.processService.deleteProcess(process.id!).subscribe({
                next: () => this.loadProcesses(),
                error: (err) => alert('Error al eliminar: ' + (err.error || err.message))
            });
        }
    }
}
