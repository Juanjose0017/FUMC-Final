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
import { NotificationService } from '../../services/notification.service';

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
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.css']
})
export class FormContainerComponent implements OnInit {
  form: any;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private authService: AuthService,
    private notify: NotificationService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    const id = this.route.snapshot.params['id'];
    this.loadForm(id);
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN' || this.currentUser?.role === 'LIDER';
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

    this.notify.showConfirm(
      'Avanzar de Fase',
      msg,
      'info',
      'Continuar',
      () => {
        this.formService.advancePhase(this.form.id).subscribe({
          next: (updated) => {
            this.form = updated;
          },
          error: (error) => {
            console.error('Error advancing phase:', error);

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
            this.notify.showToast('error', 'Error', 'Error al avanzar de fase: ' + errorMessage);
          }
        });
      }
    );
  }

  regressPhase() {
    if (this.form.currentPhase === 2) {
      this.notify.showConfirm(
        'Retroceder',
        '¿Desea volver a agregar más actividades? Podrá continuar después.',
        'warning',
        'Volver',
        () => {
          this.formService.regressPhase(this.form.id).subscribe({
            next: (updated) => {
              this.form = updated;
            },
            error: (error) => {
              if (error.error && error.error.id && error.error.currentPhase) {
                console.log('Treating error response as success because it contains a valid form');
                this.form = error.error;
                return;
              }
              this.notify.showToast('error', 'Error', 'Error: ' + (error.error || 'No se puede retroceder desde esta fase'));
            }
          });
        }
      );
    }
  }

  unlockForm() {
    this.notify.showConfirm(
      'Habilitar Edición',
      '¿Desea habilitar la edición para este formato? El formato volverá a la Fase 1 para permitir modificaciones.',
      'warning',
      'Habilitar',
      () => {
        this.formService.unlockForm(this.form.id).subscribe({
          next: (updated) => {
            this.form = updated;
            this.notify.showToast('success', 'Edición habilitada', 'El formato ahora puede ser editado.');
          },
          error: (error) => {
            console.error('Error unlocking form:', error);
            if (error.error && error.error.id && error.error.currentPhase) {
              this.form = error.error;
              this.notify.showToast('success', 'Edición habilitada', 'El formato ahora puede ser editado.');
              return;
            }
            this.notify.showToast('error', 'Error', 'No fue posible habilitar la edición.');
          }
        });
      }
    );
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
