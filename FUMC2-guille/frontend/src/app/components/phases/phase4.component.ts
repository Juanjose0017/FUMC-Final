import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-phase4',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="card">
      <h3>Fase 4: Asignación de Tiempo</h3>
      <p class="text-secondary">Asigne valores de tiempo (en minutos) para cada actividad.</p>

      <!-- Laboral Activities -->
      <h4 class="section-subtitle">Actividades Laborales</h4>
      <div class="table-responsive">
        <table>
          <thead>
              <tr>
                  <th>Descripción</th>
                  <th>Frecuencia</th>
                  <th>Prioridad</th>
                  <th width="120">Tiempo (Min)</th>
                  <th width="150">Unidad</th>
                  <th>Tiempo Anual</th>
              </tr>
          </thead>
          <tbody>
              <tr *ngFor="let activity of laboralActivities">
                  <td>{{ activity.description }}</td>
                  <td>{{ activity.frequency }}</td>
                  <td>
                      <span [class]="getPriorityClass(activity.priorityScore)">
                          {{ activity.priorityScore | number:'1.1-1' }} - {{ getPriorityLabel(activity.priorityScore) }}
                      </span>
                  </td>
                  <td>
                      <select [(ngModel)]="activity.timeValue" (change)="updateActivity(activity)" class="form-control">
                          <option value="">Sel...</option>
                          <option *ngFor="let opt of timeOptions" [value]="opt.value">{{ opt.label }}</option>
                      </select>
                  </td>
                  <td>
                      {{ activity.timeUnit }}
                  </td>
                  <td>
                      <strong>{{ calculateAnnualTime(activity) | number:'1.1-1' }}</strong>
                  </td>
              </tr>
          </tbody>
        </table>
      </div>

      <!-- Extralaboral Activities -->
      <h4 class="section-subtitle mt-4">Actividades Extralaborales</h4>
      <div class="table-responsive">
        <table>
          <thead>
              <tr>
                  <th>Descripción</th>
                  <th>Frecuencia</th>
                  <th>Prioridad</th>
                  <th width="120">Tiempo (Min)</th>
                  <th width="150">Unidad</th>
                  <th>Tiempo Anual</th>
              </tr>
          </thead>
          <tbody>
              <tr *ngFor="let activity of extralaboralActivities">
                  <td>{{ activity.description }}</td>
                  <td>{{ activity.frequency }}</td>
                  <td>
                      <span [class]="getPriorityClass(activity.priorityScore)">
                          {{ activity.priorityScore | number:'1.1-1' }} - {{ getPriorityLabel(activity.priorityScore) }}
                      </span>
                  </td>
                  <td>
                      <select [(ngModel)]="activity.timeValue" (change)="updateActivity(activity)" class="form-control">
                          <option value="">Sel...</option>
                          <option *ngFor="let opt of timeOptions" [value]="opt.value">{{ opt.label }}</option>
                      </select>
                  </td>
                  <td>
                      {{ activity.timeUnit }}
                  </td>
                  <td>
                      <strong>{{ calculateAnnualTime(activity) | number:'1.1-1' }}</strong>
                  </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    styles: [`
    .text-secondary { color: var(--text-secondary); margin-bottom: 1rem; }
    .section-subtitle { color: var(--fumc-blue-dark); margin-bottom: 1rem; border-bottom: 2px solid var(--fumc-blue-light); padding-bottom: 0.5rem; }
    .mt-4 { margin-top: 2rem; }
    .priority-high { color: #dc2626; font-weight: bold; }
    .priority-medium { color: #d97706; font-weight: bold; }
    .priority-low { color: #16a34a; font-weight: bold; }
  `]
})
export class Phase4Component {
    @Input() form: any;
    @Output() onUpdateActivity = new EventEmitter<any>();

    // minutes: number[] = [];
    timeOptions: { label: string, value: number }[] = [];

    get laboralActivities() {
        return this.form?.activities?.filter((a: any) => a.activityType === 'LABORAL') || [];
    }

    get extralaboralActivities() {
        return this.form?.activities?.filter((a: any) => a.activityType === 'EXTRALABORAL') || [];
    }

    constructor() {
        // Minutes 0 to 55
        for (let i = 0; i < 60; i += 5) {
            this.timeOptions.push({ label: `${i} Min`, value: i });
        }
        // 1 Hour
        this.timeOptions.push({ label: '1 Hora (60 Min)', value: 60 });

        // Hours 2 to 8
        for (let i = 2; i <= 8; i++) {
            this.timeOptions.push({ label: `${i} Horas`, value: i * 60 });
        }

        /*
        for (let i = 0; i <= 60; i += 5) {
            this.minutes.push(i);
        }
        */
    }

    updateActivity(activity: any) {
        this.onUpdateActivity.emit(activity);
    }

    getPriorityLabel(score: number): string {
        if (score >= 4.0) return 'Alta';
        if (score >= 2.5) return 'Media';
        return 'Baja';
    }

    getPriorityClass(score: number): string {
        if (score >= 4.0) return 'priority-high';
        if (score >= 2.5) return 'priority-medium';
        return 'priority-low';
    }

    calculateAnnualTime(activity: any): number {
        if (activity.timeValue === undefined || !activity.timeUnit) return 0;

        let factor = 0;
        switch (activity.timeUnit) {
            case 'DIA': factor = 5 * 4.3 * 12; break;
            case 'SEMANA': factor = 4.3 * 12; break;
            case 'QUINCENA': factor = 2 * 12; break;
            case 'MES': factor = 12; break;
            case 'TRIMESTRE': factor = 4; break;
            case 'SEMESTRE': factor = 2; break;
            case 'ANIO': factor = 1; break;
            case 'AÑO': factor = 1; break;
        }
        return activity.timeValue * factor;
    }
}
