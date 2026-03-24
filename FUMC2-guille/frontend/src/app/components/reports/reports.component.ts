import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormService } from '../../services/form.service';
import { RouterModule } from '@angular/router';
import { SpanishDatePipe } from '../../pipes/spanish-date.pipe';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, SpanishDatePipe],
  template: `
    <div class="container">
      <div class="header">
        <div class="brand-section">
            <img src="assets/logo.png" alt="FUMC Logo" class="app-logo">
            <div>
                <h1>Reportes Consolidados</h1>
                <p class="subtitle">Análisis de Evaluaciones de Desempeño</p>
            </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Evaluaciones</h3>
          <div class="value">{{ totalForms }}</div>
        </div>
        <div class="stat-card">
          <h3>Evaluaciones Completadas</h3>
          <div class="value">{{ completedForms.length }}</div>
        </div>
        <div class="stat-card">
          <h3>Sin Completar</h3>
          <div class="value">{{ incompleteForms }}</div>
        </div>
      </div>

      <div class="card table-card">
        <h3>Detalle por Colaborador</h3>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Cargo</th>
                <th>Área</th>
                <th>Estado</th>
                <th>Fecha Cierre</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let form of completedForms">
                <td>
                  <div class="user-cell">
                    <span class="user-name">{{ form.user?.firstName }} {{ form.user?.firstLastName }}</span>
                    <span class="user-cedula">{{ form.user?.cedula }}</span>
                  </div>
                </td>
                <td>{{ form.cargo }}</td>
                <td>{{ form.area }}</td>
                <td>
                    <span class="badge phase-5">Finalizado</span>
                </td>
                <td>{{ form.fechaFin | spanishDate }}</td>
              </tr>
              <tr *ngIf="completedForms.length === 0">
                <td colspan="5" class="text-center">No hay evaluaciones finalizadas aún.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .brand-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .app-logo {
      height: 50px;
      width: auto;
    }
    .subtitle {
        color: var(--text-secondary);
        margin: 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      border-left: 4px solid var(--fumc-fuchsia);
    }
    
    .stat-card h3 {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-card .value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--fumc-blue-dark);
    }
    
    .table-card {
      padding: 0;
      overflow: hidden;
    }
    
    .table-card h3 {
      padding: 1.5rem;
      margin: 0;
      border-bottom: 1px solid var(--border-color);
      background: #f8f9fa;
    }
    
    .user-cell {
      display: flex;
      flex-direction: column;
    }
    
    .user-name {
      font-weight: 600;
      color: var(--fumc-blue-dark);
    }
    
    .user-cedula {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    
    .badge.phase-5 { background-color: #dcfce7; color: #166534; }
  `]
})
export class ReportsComponent implements OnInit {
  completedForms: any[] = [];
  totalForms: number = 0;
  incompleteForms: number = 0;

  constructor(private formService: FormService) { }

  ngOnInit() {
    this.loadForms();
  }

  loadForms() {
    // Load all forms to get total count
    this.formService.getConsolidatedReports().subscribe({
      next: (allForms) => {
        this.totalForms = allForms.length;
        // Filter completed forms (Phase 5)
        this.completedForms = allForms.filter(form => form.currentPhase === 5);
        this.incompleteForms = this.totalForms - this.completedForms.length;
      },
      error: (error) => {
        console.error('Error loading forms:', error);
        // Fallback: try to load only completed forms
        this.formService.getCompletedForms().subscribe({
          next: (completedData) => {
            this.completedForms = completedData;
            this.totalForms = completedData.length;
            this.incompleteForms = 0;
          },
          error: (err) => console.error('Error loading completed forms:', err)
        });
      }
    });
  }
}
