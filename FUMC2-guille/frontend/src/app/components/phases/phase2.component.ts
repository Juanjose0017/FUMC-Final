import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phase2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="phase-container">
      <div class="phase-header">
        <h2>Fase 2: Frecuencia y Tiempo</h2>
        <p class="phase-description">Defina la frecuencia (1-7) y la unidad de tiempo para cada actividad.</p>
      </div>

      <!-- Laboral Activities -->
      <div class="card activity-section">
        <h3 class="section-title">Actividades Laborales</h3>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th style="width: 150px;">Frecuencia</th>
                <th style="width: 200px;">Unidad de Tiempo</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let activity of laboralActivities">
                <td>{{ activity.description }}</td>
                <td>
                  <select [(ngModel)]="activity.frequency" (change)="updateActivity(activity)" class="form-control">
                    <option value="">Sel...</option>
                    <option *ngFor="let i of [1,2,3,4,5,6,7]" [value]="i">{{ i }}</option>
                  </select>
                </td>
                <td>
                  <select [(ngModel)]="activity.timeUnit" (change)="updateActivity(activity)" class="form-control">
                    <option value="">Seleccione...</option>
                    <option value="DIA">Día</option>
                    <option value="SEMANA">Semana</option>
                    <option value="QUINCENA">Quincena</option>
                    <option value="MES">Mes</option>
                    <option value="TRIMESTRE">Trimestre</option>
                    <option value="SEMESTRE">Semestre</option>
                    <option value="AÑO">Año</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="laboralActivities.length === 0" class="empty-state">
          <p>No hay actividades laborales registradas</p>
        </div>
      </div>

      <!-- Extralaboral Activities -->
      <div class="card activity-section">
        <h3 class="section-title">Actividades Extralaborales</h3>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th style="width: 150px;">Frecuencia</th>
                <th style="width: 200px;">Unidad de Tiempo</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let activity of extralaboralActivities">
                <td>{{ activity.description }}</td>
                <td>
                  <select [(ngModel)]="activity.frequency" (change)="updateActivity(activity)" class="form-control">
                    <option value="">Sel...</option>
                    <option *ngFor="let i of [1,2,3,4,5,6,7]" [value]="i">{{ i }}</option>
                  </select>
                </td>
                <td>
                  <select [(ngModel)]="activity.timeUnit" (change)="updateActivity(activity)" class="form-control">
                    <option value="">Seleccione...</option>
                    <option value="DIA">Día</option>
                    <option value="SEMANA">Semana</option>
                    <option value="QUINCENA">Quincena</option>
                    <option value="MES">Mes</option>
                    <option value="TRIMESTRE">Trimestre</option>
                    <option value="SEMESTRE">Semestre</option>
                    <option value="AÑO">Año</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="extralaboralActivities.length === 0" class="empty-state">
          <p>No hay actividades extralaborales registradas</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .phase-container { max-width: 1200px; margin: 0 auto; }
    .phase-header { margin-bottom: 2rem; text-align: center; }
    .phase-header h2 { color: var(--fumc-blue-dark); font-size: 2rem; margin-bottom: 0.5rem; }
    .phase-description { color: var(--fumc-gray); font-size: 1rem; }
    .section-title { color: var(--fumc-blue-dark); font-size: 1.25rem; margin-bottom: 1.5rem; }
    .activity-section { margin-top: 2rem; }
    .empty-state { text-align: center; padding: 3rem 1rem; color: var(--fumc-gray); background: var(--fumc-background); border-radius: 8px; margin-top: 1rem; }
    .table-responsive { overflow-x: auto; }
    select.form-control { min-width: 120px; }
  `]
})
export class Phase2Component {
  @Input() form: any;
  @Output() onUpdateActivity = new EventEmitter<any>();

  get laboralActivities() {
    return this.form?.activities?.filter((a: any) => a.activityType === 'LABORAL') || [];
  }

  get extralaboralActivities() {
    return this.form?.activities?.filter((a: any) => a.activityType === 'EXTRALABORAL') || [];
  }

  updateActivity(activity: any) {
    this.onUpdateActivity.emit(activity);
  }
}
