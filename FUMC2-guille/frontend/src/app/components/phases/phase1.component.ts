import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcessService, Process } from '../../services/process.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-phase1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phase1.component.html',
  styleUrls: ['./phase1.component.css']
})
export class Phase1Component implements OnInit {
  @Input() form: any;
  @Input() activities: any[] = [];
  @Output() headerUpdated = new EventEmitter<any>();
  @Output() activityAdded = new EventEmitter<any>();
  @Output() activityDeleted = new EventEmitter<number>();
  @Output() activityUpdated = new EventEmitter<any>(); // Emitted when drag and drop changes type

  processes: Process[] = [];

  constructor(
    private processService: ProcessService,
    private notify: NotificationService
  ) { }

  ngOnInit() {
    if (!this.form.fechaInicio) {
      // Use local date instead of UTC to avoid timezone issues
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      this.form.fechaInicio = `${year}-${month}-${day}`;
      
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
      this.notify.showConfirm(
        'Límite Sugerido Alcanzado',
        'Ha alcanzado el límite sugerido de 20 actividades laborales. ¿Está seguro que desea agregar más actividades?',
        'warning',
        'Agregar De Todas Formas',
        () => {
          this.executeAddLaboral();
        }
      );
    } else {
      this.executeAddLaboral();
    }
  }
  
  private executeAddLaboral() {
    if (this.newLaboralActivity.description.trim()) {
      this.activityAdded.emit({ ...this.newLaboralActivity });
      this.newLaboralActivity = { description: '', type: 'ESTRATEGICA', activityType: 'LABORAL' };
      this.showAddLaboral = false;
      this.notify.showToast('success', 'Actividad laboral agregada');
    }
  }

  addExtralaboralActivity() {
    if (this.extralaboralActivities.length >= 10) {
      this.notify.showConfirm(
        'Límite Sugerido Alcanzado',
        'Ha alcanzado el límite sugerido de 10 actividades extralaborales. ¿Está seguro que desea agregar más actividades?',
        'warning',
        'Agregar De Todas Formas',
        () => {
          this.executeAddExtralaboral();
        }
      );
    } else {
      this.executeAddExtralaboral();
    }
  }

  private executeAddExtralaboral() {
    if (this.newExtralaboralActivity.description.trim()) {
      this.activityAdded.emit({ ...this.newExtralaboralActivity });
      this.newExtralaboralActivity = { description: '', type: 'ESTRATEGICA', activityType: 'EXTRALABORAL' };
      this.showAddExtralaboral = false;
      this.notify.showToast('success', 'Actividad extralaboral agregada');
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
    this.notify.showConfirm(
      'Eliminar Actividad',
      '¿Está seguro de eliminar esta actividad?',
      'danger',
      'Eliminar',
      () => {
        this.activityDeleted.emit(id);
        this.notify.showToast('success', 'Actividad Eliminada');
      }
    );
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
    this.notify.showConfirm(
      'Mover Actividad',
      '¿Estás seguro que quieres mover esta actividad?',
      'info',
      'Mover',
      () => {
        const updatedActivity = {
          ...activity,
          activityType: targetType
        };
        // Emit the update to the parent container to save to DB
        this.activityUpdated.emit(updatedActivity);
        this.notify.showToast('success', 'Actividad movida');
      }
    );
  }
}
