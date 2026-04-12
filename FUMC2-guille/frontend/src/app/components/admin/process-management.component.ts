import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcessService, Process } from '../../services/process.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-process-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="process-management">
      <div class="header">
        <h2>Gestión de Procesos</h2>
        <button (click)="openAddModal()" class="btn-generate">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Proceso
        </button>
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
                <button (click)="openEditModal(process)" class="btn-icon btn-icon-edit" title="Editar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button (click)="confirmDelete(process)" class="btn-icon btn-icon-danger" title="Eliminar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
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
    .btn-icon { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e5e7eb; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: var(--text-secondary); }
    .btn-icon-edit:hover { background: #eff6ff; border-color: #93c5fd; color: #2563eb; transform: translateY(-1px); }
    .btn-icon-danger:hover { background: #fef2f2; border-color: #fca5a5; color: #dc2626; transform: translateY(-1px); }
    .btn-icon:active { transform: translateY(0); }
    
    .empty-state { text-align: center; padding: 3rem; color: var(--text-secondary); }
    
    .btn { padding: 0.6rem 1.2rem; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .btn-primary { background: var(--fumc-blue); color: white; }
    .btn-primary:hover { background: var(--fumc-blue-dark); }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-secondary:hover { background: #5a6268; }

    .btn-generate { display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, var(--fumc-blue), #0ea5e9); color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.25s; box-shadow: 0 2px 8px rgba(0, 86, 179, 0.25); white-space: nowrap; }
    .btn-generate:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0, 86, 179, 0.35); }
    .btn-generate:active { transform: translateY(0); }
    
    
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
