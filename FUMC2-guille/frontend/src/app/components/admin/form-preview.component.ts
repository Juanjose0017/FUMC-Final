import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpanishDatePipe } from '../../pipes/spanish-date.pipe';
import { ExportService } from '../../services/export.service';
import { Phase5Component } from '../phases/phase5.component';

@Component({
  selector: 'app-form-preview',
  standalone: true,
  imports: [CommonModule, SpanishDatePipe, Phase5Component],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Vista Previa del Formulario</h2>
          <button class="close-btn" (click)="close()">&times;</button>
        </div>

        <div class="modal-body" #modalBody>
          <!-- General Information -->
          <div class="info-section">
            <h3>Información General</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Usuario:</label>
                <span>{{ getUserName() }}</span>
              </div>
              <div class="info-item">
                <label>Año:</label>
                <span>{{ formData?.year }}</span>
              </div>
              <div class="info-item">
                <label>Área:</label>
                <span>{{ formData?.area || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Proceso:</label>
                <span>{{ formData?.proceso || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <label>Fase Actual:</label>
                <span class="badge-phase">Fase {{ formData?.currentPhase }}</span>
              </div>
              <div class="info-item">
                <label>Fecha Inicio:</label>
                <span>{{ formData?.fechaInicio | spanishDate }}</span>
              </div>
            </div>
          </div>

          <!-- Activities -->
          <div class="info-section" *ngIf="formData?.activities && formData.activities.length > 0">
            <h3>Actividades ({{ formData.activities.length }})</h3>
            <div class="table-responsive">
              <table class="preview-table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Frecuencia</th>
                    <th>Unidad</th>
                    <th>Tiempo</th>
                    <th>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let activity of formData.activities">
                    <td>{{ activity.description }}</td>
                    <td>{{ activity.activityType }}</td>
                    <td>{{ activity.frequency }}</td>
                    <td>{{ activity.timeUnit }}</td>
                    <td>{{ activity.timeValue }}</td>
                    <td>{{ activity.priorityScore ? (activity.priorityScore | number:'1.2-2') : 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Phase 5 Graphs -->
          <div class="info-section" *ngIf="formData">
             <app-phase5 [form]="formData"></app-phase5>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="close()">Cerrar</button>
          <button class="btn btn-success" (click)="exportPDF()">📄 Exportar PDF</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.2s ease;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 1000px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #dee2e6;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: #0056b3;
      font-size: 1.5rem;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: #6c757d;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f8f9fa;
      color: #000;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .info-section {
      margin-bottom: 2rem;
    }

    .info-section h3 {
      color: #0056b3;
      margin-bottom: 1rem;
      font-size: 1.2rem;
      border-bottom: 2px solid #e3f2fd;
      padding-bottom: 0.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-item label {
      font-weight: 600;
      color: #6c757d;
      font-size: 0.875rem;
    }

    .info-item span {
      color: #212529;
      font-size: 1rem;
    }

    .badge-phase {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #0056b3;
      color: white;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .preview-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .preview-table th,
    .preview-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    .preview-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #0056b3;
    }

    .preview-table tbody tr:hover {
      background: #f8f9fa;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #dee2e6;
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn-success {
      background: #198754;
      color: white;
    }

    .btn-success:hover {
      background: #157347;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class FormPreviewComponent {
  @Input() formData: any;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('modalBody') modalBody!: ElementRef;

  constructor(private exportService: ExportService) { }

  getUserName(): string {
    if (!this.formData?.user) return 'N/A';
    return `${this.formData.user.firstName} ${this.formData.user.firstLastName}`;
  }

  close(): void {
    this.closeModal.emit();
  }

  exportPDF(): void {
    if (this.formData && this.modalBody) {
      const userName = this.getUserName();

      this.exportService.exportToPDF(
        this.modalBody.nativeElement,
        `Formulario_${userName.replace(/\s+/g, '_')}`
      );
    }
  }
}
