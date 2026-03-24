import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../services/auth.service';
import { Phase1Component } from '../phases/phase1.component';
import { Phase2Component } from '../phases/phase2.component';
import { Phase3Component } from '../phases/phase3.component';
import { Phase4Component } from '../phases/phase4.component';
import { Phase5Component } from '../phases/phase5.component';
import { PhaseIndicatorComponent } from '../shared/phase-indicator.component';
import { SpanishDatePipe } from '../../pipes/spanish-date.pipe';

@Component({
  selector: 'app-form-container',
  standalone: true,
  imports: [
    CommonModule,
    Phase1Component,
    Phase2Component,
    Phase3Component,
    Phase4Component,
    Phase5Component,
    PhaseIndicatorComponent,
    SpanishDatePipe
  ],
  template: `
    <div class="form-wrapper" *ngIf="form">
      <!-- Phase Indicator -->
      <app-phase-indicator [currentPhase]="form.currentPhase"></app-phase-indicator>
      <div class="top-bar">
        <button (click)="goBack()" class="btn btn-secondary" *ngIf="form.currentPhase !== 5">
          ← Volver al Tablero
        </button>
        <h1 class="form-title">
          Evaluación de Desempeño {{ form.year }} 
          <span class="form-id">#{{ getFormattedId(form.id) }}</span>
        </h1>
        <div class="progress-indicator">
          <div class="progress-step" [class.active]="form.currentPhase >= 1" [class.current]="form.currentPhase === 1">1</div>
          <div class="progress-line" [class.active]="form.currentPhase > 1"></div>
          <div class="progress-step" [class.active]="form.currentPhase >= 2" [class.current]="form.currentPhase === 2">2</div>
          <div class="progress-line" [class.active]="form.currentPhase > 2"></div>
          <div class="progress-step" [class.active]="form.currentPhase >= 3" [class.current]="form.currentPhase === 3">3</div>
          <div class="progress-line" [class.active]="form.currentPhase > 3"></div>
          <div class="progress-step" [class.active]="form.currentPhase >= 4" [class.current]="form.currentPhase === 4">4</div>
          <div class="progress-line" [class.active]="form.currentPhase > 4"></div>
          <div class="progress-step" [class.active]="form.currentPhase >= 5" [class.current]="form.currentPhase === 5">5</div>
        </div>
      </div>

      <!-- Header Info Card -->
      <div class="card info-header">
        <div class="header-content">
            <div class="logo-wrapper">
                <div class="logo-badge">
                    <img src="assets/logo.png" alt="FUMC Logo" class="form-logo">
                </div>
            </div>
            <div class="info-grid">
                <div class="info-item">
                    <label class="info-label">Empresa:</label>
                    <span class="info-value">{{ form.empresa || 'Fundación Universitaria María Cano' }}</span>
                </div>
                <div class="info-item">
                    <label class="info-label">Área:</label>
                    <span class="info-value">{{ form.area || 'No definida' }}</span>
                </div>
                <div class="info-item">
                    <label class="info-label">Proceso:</label>
                    <span class="info-value">{{ form.proceso || 'No definido' }}</span>
                </div>
                <div class="info-item">
                    <label class="info-label">Líder:</label>
                    <span class="info-value">{{ form.lider || 'No asignado' }}</span>
                </div>
                <div class="info-item">
                    <label class="info-label">Período:</label>
                    <span class="info-value">{{ form.fechaInicio | spanishDate }} - {{ form.fechaFin | spanishDate }}</span>
                </div>
            </div>
        </div>
      </div>

      <!-- Phase Components -->
      <app-phase1 *ngIf="form.currentPhase === 1" 
        [form]="form" 
        [activities]="form.activities"
        (headerUpdated)="updateHeader($event)"
        (activityAdded)="addActivity($event)"
        (activityDeleted)="deleteActivity($event)"
        (activityUpdated)="updateActivity($event)">
      </app-phase1>

      <app-phase2 *ngIf="form.currentPhase === 2" 
        [form]="form"
        (onUpdateActivity)="updateActivity($event)">
      </app-phase2>

      <app-phase3 *ngIf="form.currentPhase === 3" 
        [form]="form"
        (onUpdateActivity)="updateActivity($event)">
      </app-phase3>

      <app-phase4 *ngIf="form.currentPhase === 4" 
        [form]="form"
        (onUpdateActivity)="updateActivity($event)">
      </app-phase4>

      <app-phase5 *ngIf="form.currentPhase === 5" 
        [form]="form">
      </app-phase5>

      <!-- Navigation Actions -->
      <div class="navigation-footer">
        <button 
          *ngIf="canRegress()" 
          (click)="regressPhase()" 
          class="btn btn-secondary"
          [disabled]="!canRegress()">
          ← {{ form.currentPhase === 2 ? 'Agregar más actividades' : 'Anterior' }}
        </button>
        <div class="spacer"></div>
        
        <!-- Validation Error Messages -->
        <div *ngIf="!canAdvance() && form.currentPhase < 5" class="validation-error">
          <span class="error-icon">⚠️</span>
          <span>{{ getValidationMessage() }}</span>
        </div>
        
        <button 
          (click)="form.currentPhase === 5 ? goBack() : advancePhase()" 
          class="btn btn-primary"
          [disabled]="isActionDisabled()"
          [class.btn-disabled]="isActionDisabled()">
          {{ form.currentPhase === 5 ? 'Volver al Tablero' : 'Continuar →' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .form-wrapper {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      min-height: 100vh;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .form-title {
      color: var(--fumc-blue-dark);
      font-size: 1.75rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .form-id {
      font-size: 1rem;
      color: var(--fumc-gray);
      background: var(--fumc-gray-light);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: normal;
    }

    .progress-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .progress-step {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--fumc-gray-light);
      color: var(--fumc-gray);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .progress-step.active {
      background: var(--fumc-blue-light);
      color: white;
    }

    .progress-step.current {
      background: linear-gradient(135deg, var(--fumc-blue-dark) 0%, var(--fumc-blue) 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 61, 122, 0.3);
      transform: scale(1.1);
    }

    .progress-line {
      width: 40px;
      height: 3px;
      background: var(--fumc-gray-light);
      transition: all 0.3s ease;
    }

    .progress-line.active {
      background: var(--fumc-blue-light);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .logo-wrapper {
      flex-shrink: 0;
    }

    .logo-badge {
      background: white;
      border-radius: 50%;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 0.5rem;
    }

    .form-logo {
      max-height: 70px;
      max-width: 70px;
      mix-blend-mode: multiply;
    }

    .info-header {
      background: white;
      border: 1px solid #e5e7eb;
      border-left: 4px solid var(--fumc-blue-dark);
      margin-bottom: 2rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      flex-grow: 1;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-label {
      font-size: 0.8125rem;
      color: var(--fumc-gray);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      color: var(--fumc-gray-dark);
      font-weight: 500;
    }

    .navigation-footer {
      display: flex;
      gap: 1rem;
      margin-top: 3rem;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 -2px 8px rgba(0, 61, 122, 0.08);
      position: sticky;
      bottom: 0;
    }

    .spacer {
      flex: 1;
    }

    .validation-error {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #fef2f2;
      border: 1px solid #fca5a5;
      border-radius: 8px;
      color: #991b1b;
      font-size: 0.875rem;
      font-weight: 500;
      margin-right: 1rem;
    }

    .error-icon {
      font-size: 1.25rem;
    }

    .btn-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #9ca3af !important;
      border-color: #9ca3af !important;
    }

    .btn-disabled:hover {
      background: #9ca3af !important;
      transform: none !important;
    }

    @media (max-width: 768px) {
      .top-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .progress-indicator {
        justify-content: center;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .logo-wrapper {
        margin-bottom: 1rem;
      }

      .navigation-footer {
        flex-direction: column;
      }

      .spacer {
        display: none;
      }
    }
  `]
})
export class FormContainerComponent implements OnInit {
  form: any;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    const id = this.route.snapshot.params['id'];
    this.loadForm(id);
  }

  loadForm(id: number) {
    this.formService.getForm(id, this.currentUser.userId).subscribe(data => {
      this.form = data;
    });
  }

  updateHeader(form: any) {
    this.formService.updateHeader(this.form.id, form).subscribe(updated => {
      // Keep local state
    });
  }

  addActivity(activity: any) {
    this.formService.addActivity(this.form.id, activity).subscribe(newActivity => {
      // Use spread operator to create a new array reference, ensuring change detection triggers
      this.form.activities = [...this.form.activities, newActivity];
    });
  }

  deleteActivity(id: number) {
    this.formService.deleteActivity(id).subscribe(() => {
      this.form.activities = this.form.activities.filter((a: any) => a.id !== id);
    });
  }

  updateActivity(activity: any) {
    this.formService.updateActivity(activity.id, activity).subscribe(updated => {
      const index = this.form.activities.findIndex((a: any) => a.id === activity.id);
      if (index !== -1) {
        const newActivities = [...this.form.activities];
        newActivities[index] = updated;
        this.form.activities = newActivities;
      }
    });
  }

  canAdvance(): boolean {
    if (!this.form || this.form.currentPhase >= 5) {
      return false;
    }

    switch (this.form.currentPhase) {
      case 1:
        return this.validatePhase1();
      case 2:
        return this.validatePhase2();
      case 3:
        return this.validatePhase3();
      case 4:
        return this.validatePhase4();
      default:
        return false;
    }
  }

  validatePhase1(): boolean {
    // Check all required header fields
    if (!this.form.empresa || !this.form.empresa.trim()) return false;
    if (!this.form.area || !this.form.area.trim()) return false;
    if (!this.form.proceso || !this.form.proceso.trim()) return false;
    if (!this.form.cargo || !this.form.cargo.trim()) return false;
    if (!this.form.lider || !this.form.lider.trim()) return false;
    if (!this.form.fechaFin) return false;
    if (!this.form.weeklyWorkHours || this.form.weeklyWorkHours <= 0) return false;
    if (this.form.weeklyExtraHours === null || this.form.weeklyExtraHours === undefined || this.form.weeklyExtraHours < 0) return false;
    if (!this.form.workSchedule || !this.form.workSchedule.trim()) return false;

    // Check activities
    const laboralActivities = this.form.activities?.filter((a: any) => a.activityType === 'LABORAL') || [];
    const extralaboralActivities = this.form.activities?.filter((a: any) => a.activityType === 'EXTRALABORAL') || [];

    if (laboralActivities.length === 0) return false;
    // if (extralaboralActivities.length === 0) return false;

    return true;
  }

  validatePhase2(): boolean {
    // All activities must have frequency, timeUnit, and priorityScore
    if (!this.form.activities || this.form.activities.length === 0) return false;

    return this.form.activities.every((activity: any) => {
      return activity.frequency &&
        activity.frequency > 0 &&
        activity.timeUnit &&
        activity.timeUnit.trim() !== '';
    });
  }

  validatePhase3(): boolean {
    // All activities must have importance, coherence, and relevance
    if (!this.form.activities || this.form.activities.length === 0) return false;

    return this.form.activities.every((activity: any) => {
      return activity.importance !== null && activity.importance !== undefined &&
        activity.coherence !== null && activity.coherence !== undefined &&
        activity.relevance !== null && activity.relevance !== undefined;
    });
  }

  validatePhase4(): boolean {
    // All activities must have timeValue assigned
    if (!this.form.activities || this.form.activities.length === 0) return false;

    return this.form.activities.every((activity: any) => {
      return activity.timeValue !== null &&
        activity.timeValue !== undefined &&
        activity.timeValue > 0;
    });
  }

  isActionDisabled(): boolean {
    if (!this.form) return true;
    if (this.form.currentPhase === 5) return false; // Always enabled in Phase 5
    return !this.canAdvance();
  }

  canRegress(): boolean {
    // Only allow regression from Phase 2 to Phase 1
    return this.form && this.form.currentPhase === 2;
  }

  advancePhase() {
    const messages: any = {
      1: '¿Desea continuar a la asignación de frecuencias? No podrá agregar más actividades después.',
      2: '¿Desea continuar a la priorización de actividades?',
      3: '¿Desea continuar a la asignación de tiempos?',
      4: '¿Desea finalizar y ver el resumen? No podrá realizar más cambios.',
    };

    const msg = messages[this.form.currentPhase] || '¿Desea continuar?';

    if (confirm(msg)) {
      this.formService.advancePhase(this.form.id).subscribe({
        next: (updated) => {
          this.form = updated;
        },
        error: (error) => {
          console.error('Error advancing phase:', error);

          // Check if the "error" is actually a valid form object (workaround for potential backend status issue)
          if (error.error && error.error.id && error.error.currentPhase) {
            console.log('Treating error response as success because it contains a valid form');
            this.form = error.error;
            return;
          }

          let errorMessage = 'Error desconocido';
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = JSON.stringify(error.error);
            }
          }
          alert('Error al avanzar de fase: ' + errorMessage);
        }
      });
    }
  }

  regressPhase() {
    if (this.form.currentPhase === 2) {
      if (confirm('¿Desea volver a agregar más actividades? Podrá continuar después.')) {
        this.formService.regressPhase(this.form.id).subscribe(
          updated => {
            this.form = updated;
          },
          error => {
            alert('Error: ' + (error.error || 'No se puede retroceder desde esta fase'));
          }
        );
      }
    }
  }

  getValidationMessage(): string {
    if (!this.form) return '';

    switch (this.form.currentPhase) {
      case 1:
        if (!this.form.empresa || !this.form.area || !this.form.proceso || !this.form.cargo || !this.form.lider) {
          return 'Complete todos los campos de información institucional';
        }
        if (!this.form.fechaFin) {
          return 'Seleccione una fecha de fin';
        }
        if (!this.form.weeklyWorkHours || this.form.weeklyWorkHours <= 0) {
          return 'Ingrese las horas semanales laborales';
        }
        if (this.form.weeklyExtraHours === null || this.form.weeklyExtraHours === undefined || this.form.weeklyExtraHours < 0) {
          return 'Ingrese las horas semanales extras (puede ser 0)';
        }
        if (!this.form.workSchedule) {
          return 'Seleccione un horario';
        }
        const laboralActivities = this.form.activities?.filter((a: any) => a.activityType === 'LABORAL') || [];
        const extralaboralActivities = this.form.activities?.filter((a: any) => a.activityType === 'EXTRALABORAL') || [];
        if (laboralActivities.length === 0) {
          return 'Agregue al menos una actividad laboral';
        }
        // if (extralaboralActivities.length === 0) {
        //   return 'Agregue al menos una actividad extralaboral';
        // }
        return '';

      case 2:
        const incompleteActivity = this.form.activities?.find((a: any) =>
          !a.frequency || a.frequency <= 0 || !a.timeUnit
        );
        if (incompleteActivity) {
          return 'Complete la frecuencia y unidad de tiempo de todas las actividades';
        }
        return '';

      case 3:
        const incompletePriority = this.form.activities?.find((a: any) =>
          a.importance === null || a.importance === undefined ||
          a.coherence === null || a.coherence === undefined ||
          a.relevance === null || a.relevance === undefined
        );
        if (incompletePriority) {
          return 'Complete la importancia, coherencia y relevancia de todas las actividades';
        }
        return '';

      case 4:
        const incompleteTime = this.form.activities?.find((a: any) =>
          !a.timeValue || a.timeValue <= 0
        );
        if (incompleteTime) {
          return 'Complete el tiempo de todas las actividades';
        }
        return '';

      default:
        return '';
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getFormattedId(id: number): string {
    return id ? id.toString().padStart(5, '0') : '00000';
  }
}
