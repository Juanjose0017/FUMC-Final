import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcessService, Process } from '../../services/process.service';

@Component({
  selector: 'app-phase1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="phase-container">
      <div class="phase-header">
        <h2>Registro de Actividades</h2>
        <p class="phase-description">Complete la información institucional y registre sus actividades laborales y extralaborales</p>
      </div>

      <!-- Headers Section -->
      <div class="card">
        <h3 class="section-title">Información Institucional</h3>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Empresa</label>
            <input [(ngModel)]="form.empresa" (change)="updateHeader()" class="form-control" placeholder="Nombre de la empresa">
          </div>
          <div class="form-group">
            <label class="form-label">Área</label>
            <input [(ngModel)]="form.area" (change)="updateHeader()" class="form-control" placeholder="Área de trabajo">
          </div>
          <div class="form-group">
            <label class="form-label">Proceso</label>
            <select [(ngModel)]="form.proceso" (change)="updateHeader()" class="form-control">
              <option value="">Seleccione un proceso...</option>
              <option *ngFor="let process of processes" [value]="process.name">{{ process.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Cargo</label>
            <input [(ngModel)]="form.cargo" (change)="updateHeader()" class="form-control" placeholder="Cargo">
          </div>
          <div class="form-group">
            <label class="form-label">Líder</label>
            <input [(ngModel)]="form.lider" (change)="updateHeader()" class="form-control" placeholder="Nombre del líder">
          </div>
          <div class="form-group">
            <label class="form-label">Fecha Inicio</label>
            <input type="date" [ngModel]="form.fechaInicio" readonly class="form-control" style="background-color: #e9ecef;">
          </div>
          <div class="form-group">
            <label class="form-label">Fecha Fin</label>
            <input type="date" [(ngModel)]="form.fechaFin" [min]="form.fechaInicio" (change)="updateHeader()" class="form-control">
          </div>
          <div class="form-group">
            <label class="form-label">Horas Semanales Laborales</label>
            <input type="number" [(ngModel)]="form.weeklyWorkHours" (change)="updateHeader()" class="form-control" placeholder="Ej: 40">
          </div>
          <div class="form-group">
            <label class="form-label">Horas Semanales Extras</label>
            <input type="number" [(ngModel)]="form.weeklyExtraHours" (change)="updateHeader()" class="form-control" placeholder="Ej: 5">
          </div>
          <div class="form-group">
            <label class="form-label">Horario</label>
            <select [(ngModel)]="form.workSchedule" (change)="updateHeader()" class="form-control">
              <option value="">Seleccione...</option>
              <option value="Lunes a Viernes">Lunes a Viernes</option>
              <option value="Lunes a Sábado">Lunes a Sábado</option>
              <option value="7/24">7/24</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Laboral Activities Section -->
      <div class="card activity-section">
        <div class="section-header-with-action">
          <div>
            <h3 class="section-title">Actividades Laborales</h3>
            <p class="section-subtitle">Actividades relacionadas con su trabajo en la institución (Sugerido: 20 máximo)</p>
          </div>
          <button (click)="showAddLaboral = true" class="btn btn-primary">
            <span class="btn-icon">+</span> Agregar Actividad Laboral
          </button>
        </div>

        <!-- Add Laboral Activity Form -->
        <div *ngIf="showAddLaboral" class="add-activity-form">
          <h4>Nueva Actividad Laboral</h4>
          <div class="form-group">
            <label class="form-label">Descripción de la Actividad</label>
            <textarea [(ngModel)]="newLaboralActivity.description" class="form-control" rows="3" placeholder="Describa la actividad laboral..."></textarea>
          </div>
          <div class="form-actions">
            <button (click)="addLaboralActivity()" class="btn btn-primary">Guardar</button>
            <button (click)="cancelAddLaboral()" class="btn btn-secondary">Cancelar</button>
          </div>
        </div>

        <div *ngIf="laboralActivities.length > 0" class="activities-table">
          <table>
            <thead>
              <tr>
                <th class="number-column">N°</th>
                <th>Descripción</th>
                <th class="actions-column">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let activity of laboralActivities; let i = index">
                <td class="number-column">{{ i + 1 }}</td>
                <td>
                  {{ activity.description }}
                </td>
                <td class="actions-column">
                  <div class="action-buttons">
                    <button (click)="moveActivity(activity, 'EXTRALABORAL')" class="btn-icon-move" title="Mover a Extralaborales">
                      ⬇️
                    </button>
                    <button (click)="deleteActivity(activity.id)" class="btn-icon-danger" title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="laboralActivities.length === 0 && !showAddLaboral" class="empty-state">
          <p>No hay actividades laborales registradas</p>
        </div>

      </div>

      <!-- Extralaboral Activities Section -->
      <div class="card activity-section">
        <div class="section-header-with-action">
          <div>
            <h3 class="section-title">Actividades Extralaborales</h3>
            <p class="section-subtitle">Actividades fuera del ámbito laboral institucional (Sugerido: 10 máximo)</p>
          </div>
          <button (click)="showAddExtralaboral = true" class="btn btn-secondary">
            <span class="btn-icon">+</span> Agregar Actividad Extralaboral
          </button>
        </div>

        <!-- Add Extralaboral Activity Form -->
        <div *ngIf="showAddExtralaboral" class="add-activity-form">
          <h4>Nueva Actividad Extralaboral</h4>
          <div class="form-group">
            <label class="form-label">Descripción de la Actividad</label>
            <textarea [(ngModel)]="newExtralaboralActivity.description" class="form-control" rows="3" placeholder="Describa la actividad extralaboral..."></textarea>
          </div>
          <div class="form-actions">
            <button (click)="addExtralaboralActivity()" class="btn btn-primary">Guardar</button>
            <button (click)="cancelAddExtralaboral()" class="btn btn-secondary">Cancelar</button>
          </div>
        </div>

        <div *ngIf="extralaboralActivities.length > 0" class="activities-table">
          <table>
            <thead>
              <tr>
                <th class="number-column">N°</th>
                <th>Descripción</th>
                <th class="actions-column">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let activity of extralaboralActivities; let i = index">
                <td class="number-column">{{ i + 1 }}</td>
                <td>
                  {{ activity.description }}
                </td>
                <td class="actions-column">
                  <div class="action-buttons">
                    <button (click)="moveActivity(activity, 'LABORAL')" class="btn-icon-move" title="Mover a Laborales">
                      ⬆️
                    </button>
                    <button (click)="deleteActivity(activity.id)" class="btn-icon-danger" title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="extralaboralActivities.length === 0 && !showAddExtralaboral" class="empty-state">
          <p>No hay actividades extralaborales registradas</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .phase-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .phase-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .phase-header h2 {
      color: var(--fumc-blue-dark);
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .phase-description {
      color: var(--fumc-gray);
      font-size: 1rem;
    }

    .section-title {
      color: var(--fumc-blue-dark);
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .section-subtitle {
      color: var(--fumc-gray);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }

    .activity-section {
      margin-top: 2rem;
    }

    .section-header-with-action {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .btn-icon {
      font-size: 1.25rem;
      margin-right: 0.5rem;
    }

    .add-activity-form {
      background: var(--fumc-background);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      border: 2px solid var(--fumc-blue-light);
    }

    .add-activity-form h4 {
      color: var(--fumc-blue-dark);
      margin-bottom: 1rem;
      font-size: 1.125rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .activities-table {
      margin-top: 1rem;
      width: 100%;
      overflow-x: auto;
    }
    
    .activities-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .activities-table th,
    .activities-table td {
      padding: 0.75rem 0.5rem;
      border-bottom: 1px solid #eee;
      text-align: left;
    }

    .activities-table th {
      color: var(--fumc-blue-dark);
      font-weight: 600;
    }

    .actions-column {
      width: 120px;
      text-align: center;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      align-items: center;
    }

    .btn-icon-move {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      padding: 0.25rem;
      transition: transform 0.2s;
    }

    .btn-icon-move:hover {
      transform: scale(1.2) translateY(-2px);
    }

    .btn-icon-danger {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      padding: 0.25rem 0.5rem;
      transition: transform 0.2s;
    }

    .btn-icon-danger:hover {
      transform: scale(1.2);
    }

    .badge {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-ESTRATEGICA {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .badge-MISIONAL {
      background-color: #f3e5f5;
      color: #6a1b9a;
    }

    .badge-APOYO {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--fumc-gray);
      background: var(--fumc-background);
      border-radius: 8px;
      margin-top: 1rem;
    }


    @media (max-width: 768px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }

      .section-header-with-action {
        flex-direction: column;
        gap: 1rem;
      }

      .section-header-with-action button {
        width: 100%;
      }
    }
  `]
})
export class Phase1Component implements OnInit {
  @Input() form: any;
  @Input() activities: any[] = [];
  @Output() headerUpdated = new EventEmitter<any>();
  @Output() activityAdded = new EventEmitter<any>();
  @Output() activityDeleted = new EventEmitter<number>();
  @Output() activityUpdated = new EventEmitter<any>(); // Emitted when drag and drop changes type

  processes: Process[] = [];

  constructor(private processService: ProcessService) { }

  ngOnInit() {
    if (!this.form.fechaInicio) {
      this.form.fechaInicio = new Date().toISOString().split('T')[0];
      this.updateHeader();
    }
    this.loadProcesses();
  }

  loadProcesses() {
    this.processService.getActiveProcesses().subscribe({
      next: (data) => this.processes = data,
      error: (err) => console.error('Error loading processes:', err)
    });
  }

  showAddLaboral = false;
  showAddExtralaboral = false;

  newLaboralActivity = { description: '', type: 'ESTRATEGICA', activityType: 'LABORAL' };
  newExtralaboralActivity = { description: '', type: 'ESTRATEGICA', activityType: 'EXTRALABORAL' };

  get laboralActivities() {
    return this.activities.filter(a => a.activityType === 'LABORAL');
  }

  get extralaboralActivities() {
    return this.activities.filter(a => a.activityType === 'EXTRALABORAL');
  }

  updateHeader() {
    this.headerUpdated.emit(this.form);
  }

  addLaboralActivity() {
    if (this.laboralActivities.length >= 20) {
      const continueAdding = confirm('Ha alcanzado el límite sugerido de 20 actividades laborales. ¿Está seguro que desea agregar más actividades?');
      if (!continueAdding) {
        return;
      }
    }
    if (this.newLaboralActivity.description.trim()) {
      this.activityAdded.emit({ ...this.newLaboralActivity });
      this.newLaboralActivity = { description: '', type: 'ESTRATEGICA', activityType: 'LABORAL' };
      this.showAddLaboral = false;
    }
  }

  addExtralaboralActivity() {
    if (this.extralaboralActivities.length >= 10) {
      const continueAdding = confirm('Ha alcanzado el límite sugerido de 10 actividades extralaborales. ¿Está seguro que desea agregar más actividades?');
      if (!continueAdding) {
        return;
      }
    }
    if (this.newExtralaboralActivity.description.trim()) {
      this.activityAdded.emit({ ...this.newExtralaboralActivity });
      this.newExtralaboralActivity = { description: '', type: 'ESTRATEGICA', activityType: 'EXTRALABORAL' };
      this.showAddExtralaboral = false;
    }
  }

  cancelAddLaboral() {
    this.newLaboralActivity = { description: '', type: 'ESTRATEGICA', activityType: 'LABORAL' };
    this.showAddLaboral = false;
  }

  cancelAddExtralaboral() {
    this.newExtralaboralActivity = { description: '', type: 'ESTRATEGICA', activityType: 'EXTRALABORAL' };
    this.showAddExtralaboral = false;
  }

  deleteActivity(id: number) {
    if (confirm('¿Está seguro de eliminar esta actividad?')) {
      this.activityDeleted.emit(id);
    }
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      'ESTRATEGICA': 'Estratégica',
      'MISIONAL': 'Misional',
      'APOYO': 'Apoyo'
    };
    return labels[type] || type;
  }

  // --- Move Activity Logic ---
  moveActivity(activity: any, targetType: 'LABORAL' | 'EXTRALABORAL') {
    if (confirm('¿Estás seguro que quieres mover esta actividad?')) {
      const updatedActivity = {
        ...activity,
        activityType: targetType
      };
      // Emit the update to the parent container to save to DB
      this.activityUpdated.emit(updatedActivity);
    }
  }
}
