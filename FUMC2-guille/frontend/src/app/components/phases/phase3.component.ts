import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-phase3',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="card">
      <h3>Fase 3: Priorización</h3>
      <p class="text-secondary">Califique Importancia (50%), Coherencia (30%) y Relevancia (20%) en una escala de 0 a 10.</p>

      <!-- Laboral Activities -->
      <h4 class="section-subtitle">Actividades Laborales</h4>
      <table>
        <thead>
            <tr>
                <th>Descripción</th>
                <th>Frecuencia</th>
                <th>Unidad de Tiempo</th>
                <th width="100">Imp (0-10)</th>
                <th width="100">Coh (0-10)</th>
                <th width="100">Rel (0-10)</th>
                <th>Prioridad</th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let activity of laboralActivities">
                <td>{{ activity.description }}</td>
                <td>{{ activity.frequency }}</td>
                <td>{{ activity.timeUnit }}</td>
                <td>
                    <input type="number" [(ngModel)]="activity.importance" (change)="updateActivity(activity)" class="form-control" min="0" max="10">
                </td>
                <td>
                    <input type="number" [(ngModel)]="activity.coherence" (change)="updateActivity(activity)" class="form-control" min="0" max="10">
                </td>
                <td>
                    <input type="number" [(ngModel)]="activity.relevance" (change)="updateActivity(activity)" class="form-control" min="0" max="10">
                </td>
                <td>
                    <strong>{{ calculatePriority(activity) | number:'1.1-1' }}</strong>
                </td>
            </tr>
        </tbody>
      </table>

      <!-- Extralaboral Activities -->
      <h4 class="section-subtitle mt-4">Actividades Extralaborales</h4>
      <table>
        <thead>
            <tr>
                <th>Descripción</th>
                <th>Frecuencia</th>
                <th>Unidad de Tiempo</th>
                <th width="100">Imp (0-10)</th>
                <th width="100">Coh (0-10)</th>
                <th width="100">Rel (0-10)</th>
                <th>Prioridad</th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let activity of extralaboralActivities">
                <td>{{ activity.description }}</td>
                <td>{{ activity.frequency }}</td>
                <td>{{ activity.timeUnit }}</td>
                <td>
                    <input type="number" [(ngModel)]="activity.importance" (change)="updateActivity(activity)" class="form-control" min="0" max="10">
                </td>
                <td>
                    <input type="number" [(ngModel)]="activity.coherence" (change)="updateActivity(activity)" class="form-control" min="0" max="10">
                </td>
                <td>
                    <input type="number" [(ngModel)]="activity.relevance" (change)="updateActivity(activity)" class="form-control" min="0" max="10">
                </td>
                <td>
                    <strong>{{ calculatePriority(activity) | number:'1.1-1' }}</strong>
                </td>
            </tr>
        </tbody>
      </table>
    </div>
  `,
    styles: [`
    .text-secondary { color: var(--text-secondary); margin-bottom: 1rem; }
    input[type=number] { width: 80px; }
    .section-subtitle { color: var(--fumc-blue-dark); margin-top: 1.5rem; margin-bottom: 0.5rem; border-bottom: 2px solid var(--fumc-blue-light); padding-bottom: 0.5rem; }
    .mt-4 { margin-top: 2rem; }
  `]
})
export class Phase3Component {
    @Input() form: any;
    @Output() onUpdateActivity = new EventEmitter<any>();

    get laboralActivities() {
        return this.form?.activities?.filter((a: any) => a.activityType === 'LABORAL') || [];
    }

    get extralaboralActivities() {
        return this.form?.activities?.filter((a: any) => a.activityType === 'EXTRALABORAL') || [];
    }

    updateActivity(activity: any) {
        activity.priorityScore = this.calculatePriority(activity);
        this.onUpdateActivity.emit(activity);
    }

    calculatePriority(activity: any): number {
        const imp = activity.importance || 0;
        const coh = activity.coherence || 0;
        const rel = activity.relevance || 0;
        return (imp * 0.5) + (coh * 0.3) + (rel * 0.2);
    }
}
