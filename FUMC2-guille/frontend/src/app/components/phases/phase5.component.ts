import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-phase5',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template:`
    <div class="card">
      <h3>Fase 5: Resumen de Resultados</h3>
      <p class="text-secondary">Resultados finales consolidados. Solo lectura.</p>

      <!-- Tabs Navigation -->
      <div class="tabs-container">
        <button (click)="setTab('resumen')" [class.active]="currentTab === 'resumen'" class="tab-button">
          📋 Resumen General
        </button>
        <button (click)="setTab('porcentajes')" [class.active]="currentTab === 'porcentajes'" class="tab-button">
          📊 Distribución Porcentual
        </button>
        <button (click)="setTab('graficos')" [class.active]="currentTab === 'graficos'" class="tab-button">
          📈 Análisis Gráfico
        </button>
        <button (click)="setTab('detalle')" [class.active]="currentTab === 'detalle'" class="tab-button">
          📑 Detalle Completo
        </button>
      </div>

      <!-- Tab Content: Resumen General -->
      <div *ngIf="currentTab === 'resumen'" class="tab-content">
        <h4 class="section-subtitle">Resumen General</h4>
        
        <!-- Laboral Summary -->
      <h4 class="section-subtitle">Actividades Laborales</h4>
      <div class="table-responsive">
        <table>
          <thead>
              <tr>
                  <th>Descripción</th>
                  <th>Frecuencia</th>
                  <th>Unidad Frec.</th>
                  <th>Prioridad</th>
                  <th>Tiempo (Min)</th>
                  <th>Min/Día</th>
                  <th>Min/Semana</th>
                  <th>Min/Quincena</th>
                  <th>Min/Mes</th>
                  <th>Min/Trimestre</th>
                  <th>Min/Semestre</th>
                  <th>Min/Anual</th>
              </tr>
          </thead>
          <tbody>
              <tr *ngFor="let activity of laboralActivities">
                  <td>{{ activity.description }}</td>
                  <td>{{ activity.frequency }}</td>
                  <td>{{ activity.timeUnit }}</td>
                  <td>
                    <span [class]="getPriorityClass(activity.priorityScore)">
                      {{ activity.priorityScore | number:'1.1-1' }} ({{ getPriorityLabel(activity.priorityScore) }})
                    </span>
                  </td>
                  <td>{{ activity.timeValue }}</td>
                  <td>{{ calculateTime(activity, 'DIA') | number:'1.0-0' }}</td>
                  <td>{{ calculateTime(activity, 'SEMANA') | number:'1.0-0' }}</td>
                  <td>{{ calculateTime(activity, 'QUINCENA') | number:'1.0-0' }}</td>
                  <td>{{ calculateTime(activity, 'MES') | number:'1.0-0' }}</td>
                  <td>{{ calculateTime(activity, 'TRIMESTRE') | number:'1.0-0' }}</td>
                  <td>{{ calculateTime(activity, 'SEMESTRE') | number:'1.0-0' }}</td>
                  <td><strong>{{ calculateAnnualTime(activity) | number:'1.0-0' }}</strong></td>
              </tr>
              <tr class="total-row">
                  <td colspan="5" style="text-align: right;"><strong>Total Minutos:</strong></td>
                  <td><strong>{{ getTotalMinutes('LABORAL', 'DIA') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('LABORAL', 'SEMANA') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('LABORAL', 'QUINCENA') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('LABORAL', 'MES') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('LABORAL', 'TRIMESTRE') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('LABORAL', 'SEMESTRE') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('LABORAL', 'ANUAL') | number:'1.0-0' }}</strong></td>
              </tr>
              <tr class="total-row">
                  <td colspan="5" style="text-align: right;"><strong>Total Horas:</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('LABORAL', 'DIA')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('LABORAL', 'SEMANA')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('LABORAL', 'QUINCENA')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('LABORAL', 'MES')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('LABORAL', 'TRIMESTRE')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('LABORAL', 'SEMESTRE')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('LABORAL', 'ANUAL')) }}</strong></td>
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
                  <th>Unidad Frec.</th>
                  <th>Prioridad</th>
                  <th>Tiempo (Min)</th>
                  <th>Min/Día</th>
                  <th>Min/Semana</th>
                  <th>Min/Quincena</th>
                  <th>Min/Mes</th>
                  <th>Min/Trimestre</th>
                  <th>Min/Semestre</th>
                  <th>Min/Anual</th>
              </tr>
          </thead>
          <tbody>
              <tr *ngFor="let activity of extralaboralActivities">
                  <td>{{ activity.description }}</td>
                  <td>{{ activity.frequency }}</td>
                  <td>{{ activity.timeUnit }}</td>
                  <td>
                    <span [class]="getPriorityClass(activity.priorityScore)">
                      {{ activity.priorityScore | number:'1.1-1' }} ({{ getPriorityLabel(activity.priorityScore) }})
                    </span>
                  </td>
                  <td>{{ activity.timeValue }}</td>
                  <td>{{ calculateTime(activity, 'DIA') | number:'1.0-0' }}</td>
                  <td>{{ calculateTime(activity, 'SEMANA') | number:'1.0-0' }}</td>
                  <td>{{ calculateTime(activity, 'QUINCENA') | number:'1.0-0' }}</td>
                  <td>{{ calculateTime(activity, 'MES') | number:'1.0-0' }}</td>
                  <td>{{ calculateTime(activity, 'TRIMESTRE') | number:'1.0-0' }}</td>
                  <td>{{ calculateTime(activity, 'SEMESTRE') | number:'1.0-0' }}</td>
                  <td><strong>{{ calculateAnnualTime(activity) | number:'1.0-0' }}</strong></td>
              </tr>
              <tr class="total-row">
                  <td colspan="5" style="text-align: right;"><strong>Total Minutos:</strong></td>
                  <td><strong>{{ getTotalMinutes('EXTRALABORAL', 'DIA') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('EXTRALABORAL', 'SEMANA') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('EXTRALABORAL', 'QUINCENA') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('EXTRALABORAL', 'MES') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('EXTRALABORAL', 'TRIMESTRE') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('EXTRALABORAL', 'SEMESTRE') | number:'1.0-0' }}</strong></td>
                  <td><strong>{{ getTotalMinutes('EXTRALABORAL', 'ANUAL') | number:'1.0-0' }}</strong></td>
              </tr>
              <tr class="total-row">
                  <td colspan="5" style="text-align: right;"><strong>Total Horas:</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('EXTRALABORAL', 'DIA')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('EXTRALABORAL', 'SEMANA')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('EXTRALABORAL', 'QUINCENA')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('EXTRALABORAL', 'MES')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('EXTRALABORAL', 'TRIMESTRE')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('EXTRALABORAL', 'SEMESTRE')) }}</strong></td>
                  <td><strong>{{ formatHours(getTotalMinutes('EXTRALABORAL', 'ANUAL')) }}</strong></td>
              </tr>
          </tbody>
        </table>
      </div>
      </div>

      <!-- Tab Content: Distribución Porcentual -->
      <div *ngIf="currentTab === 'porcentajes'" class="tab-content">
        <h4 class="section-subtitle">Distribución Porcentual por Frecuencia</h4>
      <p class="text-secondary">Cada grupo de frecuencia suma 100% del tiempo asignado a esa frecuencia</p>
      
      <!-- Laboral Percentages by Frequency -->
      <div class="percentage-section">
        <h5 class="subsection-title">Actividades Laborales - Porcentajes por Frecuencia</h5>
        <div *ngFor="let unit of getUniqueFrequencyUnits('LABORAL')" class="frequency-group">
          <h6 class="frequency-title">{{ unit }}</h6>
          <div class="table-responsive">
            <table class="percentage-table">
              <thead>
                <tr>
                  <th>Actividad</th>
                  <th>Tiempo Anual (Min)</th>
                  <th>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let activity of getActivitiesByFrequency(unit, 'LABORAL')">
                  <td>{{ activity.description }}</td>
                  <td>{{ calculateAnnualTime(activity) | number:'1.0-0' }}</td>
                  <td>
                    <div class="percentage-bar-container">
                      <div class="percentage-bar" [style.width.%]="getPercentageInFrequencyGroup(activity, 'LABORAL')"></div>
                      <span class="percentage-text">{{ getPercentageInFrequencyGroup(activity, 'LABORAL') | number:'1.1-1' }}%</span>
                    </div>
                  </td>
                </tr>
                <tr class="total-row">
                  <td><strong>Total {{ unit }}</strong></td>
                  <td><strong>{{ getFrequencyGroupTotal(unit, 'LABORAL') | number:'1.0-0' }}</strong></td>
                  <td><strong>100.0%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Extralaboral Percentages by Frequency -->
      <div class="percentage-section" *ngIf="getUniqueFrequencyUnits('EXTRALABORAL').length > 0">
        <h5 class="subsection-title">Actividades Extralaborales - Porcentajes por Frecuencia</h5>
        <div *ngFor="let unit of getUniqueFrequencyUnits('EXTRALABORAL')" class="frequency-group">
          <h6 class="frequency-title">{{ unit }}</h6>
          <div class="table-responsive">
            <table class="percentage-table">
              <thead>
                <tr>
                  <th>Actividad</th>
                  <th>Tiempo Anual (Min)</th>
                  <th>Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let activity of getActivitiesByFrequency(unit, 'EXTRALABORAL')">
                  <td>{{ activity.description }}</td>
                  <td>{{ calculateAnnualTime(activity) | number:'1.0-0' }}</td>
                  <td>
                    <div class="percentage-bar-container">
                      <div class="percentage-bar" [style.width.%]="getPercentageInFrequencyGroup(activity, 'EXTRALABORAL')"></div>
                      <span class="percentage-text">{{ getPercentageInFrequencyGroup(activity, 'EXTRALABORAL') | number:'1.1-1' }}%</span>
                    </div>
                  </td>
                </tr>
                <tr class="total-row">
                  <td><strong>Total {{ unit }}</strong></td>
                  <td><strong>{{ getFrequencyGroupTotal(unit, 'EXTRALABORAL') | number:'1.0-0' }}</strong></td>
                  <td><strong>100.0%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Overall Frequency Distribution Summary -->
      <h4 class="section-subtitle mt-4">Resumen General - Distribución por Unidad de Frecuencia</h4>
      <p class="text-secondary">Distribución total del tiempo entre todas las frecuencias (suma 100%)</p>
      <div class="table-responsive">
        <table class="summary-table">
          <thead>
            <tr>
              <th>Unidad de Frecuencia</th>
              <th>Horas Anuales</th>
              <th>Porcentaje del Total</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let freq of getOverallFrequencyPercentages()">
              <td><strong>{{ freq.unit }}</strong></td>
              <td>{{ freq.hours | number:'1.1-1' }}</td>
              <td>
                <div class="percentage-bar-container">
                  <div class="percentage-bar overall" [style.width.%]="freq.percentage"></div>
                  <span class="percentage-text">{{ freq.percentage | number:'1.1-1' }}%</span>
                </div>
              </td>
            </tr>
            <tr class="grand-total-row">
              <td colspan="2"><strong>TOTAL GENERAL</strong></td>
              <td><strong>100.0%</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>

      <!-- Tab Content: Análisis Gráfico -->
      <div *ngIf="currentTab === 'graficos'" class="tab-content">
        <h3 class="text-center">Análisis Gráfico</h3>
        
        <div class="charts-grid">
          <div class="chart-container">
            <h4>Distribución Laboral (Tiempo)</h4>
            <div class="canvas-wrapper">
              <canvas baseChart
                [data]="laboralChartData"
                [options]="pieChartOptions"
                [type]="'pie'">
              </canvas>
            </div>
          </div>
          <div class="chart-container">
            <h4>Distribución Extralaboral (Tiempo)</h4>
            <div class="canvas-wrapper">
              <canvas baseChart
                [data]="extralaboralChartData"
                [options]="pieChartOptions"
                [type]="'pie'">
              </canvas>
            </div>
          </div>
        </div>

        <div class="chart-container full-width-chart mt-5">
          <h4>Distribución por Unidad de Frecuencia (Tiempo Total)</h4>
          <div class="canvas-wrapper">
            <canvas baseChart
              [data]="frequencyUnitChartData"
              [options]="pieChartOptions"
              [type]="'pie'">
            </canvas>
          </div>
        </div>
      </div>

      <!-- Tab Content: Detalle Completo -->
      <div *ngIf="currentTab === 'detalle'" class="tab-content">
        <h4 class="section-subtitle">Detalle Completo de Actividades</h4>
        <p class="text-secondary">Tablas completas con todos los cálculos detallados por período.</p>
        
        <!-- Este tab mostrará las tablas completas que están actualmente en el tab "resumen" -->
        <!-- Por ahora, redirigimos al usuario al tab resumen para ver los detalles -->
        <div class="info-box">
          <p>📊 Las tablas detalladas se encuentran en la pestaña <strong>"Resumen General"</strong>.</p>
          <p>Esta sección está reservada para futuras expansiones de análisis detallado.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge { padding: 0.25rem 0.5rem; background: #eee; border-radius: 4px; font-size: 0.8rem; }
    .text-secondary { color: var(--text-secondary); margin-bottom: 1rem; }
    .total-row { background-color: var(--fumc-blue-light); color: var(--fumc-blue-dark); font-size: 0.9rem; }
    .table-responsive { overflow-x: auto; margin-bottom: 2rem; }
    
    /* Tabs Styles */
    .tabs-container {
      display: flex;
      gap: 0.5rem;
      margin: 1.5rem 0;
      border-bottom: 2px solid var(--border-color);
      overflow-x: auto;
    }
    
    .tab-button {
      padding: 0.75rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.95rem;
      color: var(--text-secondary);
      transition: all 0.2s;
      white-space: nowrap;
    }
    
    .tab-button:hover {
      background: var(--fumc-gray-light);
      color: var(--fumc-blue-dark);
    }
    
    .tab-button.active {
      color: var(--fumc-blue);
      border-bottom-color: var(--fumc-blue);
      background: var(--fumc-blue-light);
      font-weight: 600;
    }
    
    .tab-content {
      animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .info-box {
      background: #f0f9ff;
      border-left: 4px solid var(--fumc-blue);
      padding: 1.5rem;
      border-radius: 6px;
      margin: 2rem 0;
    }
    
    .info-box p {
      margin: 0.5rem 0;
      color: var(--fumc-blue-dark);
    }
    
    .charts-section { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border-color); }
    .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .chart-container { display: flex; flex-direction: column; align-items: center; background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .canvas-wrapper { position: relative; height: 300px; width: 100%; display: flex; justify-content: center; }
    .full-width-chart { max-width: 600px; margin: 2rem auto 0; }
    .text-center { text-align: center; }
    
    .section-subtitle { color: var(--fumc-blue-dark); margin-top: 1.5rem; margin-bottom: 0.5rem; border-bottom: 2px solid var(--fumc-blue-light); padding-bottom: 0.5rem; }
    .mt-4 { margin-top: 2rem; }
    .mt-5 { margin-top: 3rem; }
    
    .priority-high { color: #dc2626; font-weight: bold; }
    .priority-medium { color: #d97706; font-weight: bold; }
    .priority-low { color: #16a34a; font-weight: bold; }
    
    th { font-size: 0.85rem; white-space: nowrap; }
    td { font-size: 0.9rem; }
    
    /* Percentage Section Styles */
    .percentage-section { margin-top: 2rem; padding: 1.5rem; background: #f9fafb; border-radius: 8px; }
    .subsection-title { color: var(--fumc-blue-dark); font-size: 1.1rem; margin-bottom: 1rem; font-weight: 600; }
    .frequency-group { margin-bottom: 2rem; padding: 1rem; background: white; border-radius: 6px; border-left: 4px solid var(--fumc-blue); }
    .frequency-title { color: var(--fumc-blue); font-size: 1rem; margin-bottom: 0.75rem; font-weight: 600; }
    .percentage-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    .percentage-table th { background: var(--fumc-blue-light); padding: 0.75rem; text-align: left; }
    .percentage-table th:nth-child(1) { width: 40%; }
    .percentage-table th:nth-child(2) { width: 20%; }
    .percentage-table th:nth-child(3) { width: 40%; }
    .percentage-table td { padding: 0.75rem; border-bottom: 1px solid #e5e7eb; }
    .percentage-bar-container { 
      position: relative; 
      width: 100%; 
      height: 30px; 
      background: #e5e7eb; 
      border-radius: 4px; 
      overflow: hidden;
      display: flex;
      align-items: center;
    }
    .percentage-bar { 
      position: absolute; 
      left: 0;
      top: 0;
      height: 100%; 
      background: linear-gradient(90deg, var(--fumc-blue) 0%, #0ea5e9 100%); 
      transition: width 0.3s ease; 
    }
    .percentage-bar.overall { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }
    .percentage-text { 
      position: relative; 
      width: 100%; 
      text-align: center; 
      line-height: 30px; 
      font-weight: 600; 
      color: #1f2937; 
      z-index: 1; 
    }
    .summary-table { width: 100%; border-collapse: collapse; margin-top: 1rem; table-layout: fixed; }
    .summary-table th { background: var(--fumc-blue-dark); color: white; padding: 1rem; text-align: left; }
    .summary-table th:nth-child(1) { width: 30%; }
    .summary-table th:nth-child(2) { width: 25%; }
    .summary-table th:nth-child(3) { width: 45%; }
    .summary-table td { padding: 1rem; border-bottom: 1px solid #e5e7eb; }
    .grand-total-row { background: #dcfce7; font-size: 1.1rem; }
    .grand-total-row td { border-top: 3px solid var(--fumc-blue); padding: 1rem; }
  `]
})
export class Phase5Component implements OnChanges {
  @Input() form: any;

  // Tab state
  currentTab: 'resumen' | 'porcentajes' | 'graficos' | 'detalle' = 'resumen';

  // Method to change tab
  setTab(tab: 'resumen' | 'porcentajes' | 'graficos' | 'detalle') {
    this.currentTab = tab;
  }

  // Warm and Varied Palette
  private warmColors = [
    '#FF6B6B', '#FFD93D', '#FF8E3C', '#FF5252', '#E040FB',
    '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
    '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFAB00'
  ];

  public pieChartOptions: ChartConfiguration['options'] | any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { boxWidth: 15, padding: 15 }
      },
      datalabels: {
        formatter: (value: any, ctx: any) => {
          if (value === 0) return '';
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data: number) => { sum += data; });
          let percentage = (value * 100 / sum).toFixed(1) + "%";
          return percentage;
        },
        color: '#fff',
        font: { weight: 'bold', size: 10 }
      }
    }
  };

  public laboralChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };
  public extralaboralChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };
  public frequencyUnitChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['form'] && this.form) {
      this.updateChartData();
    }
  }

  get laboralActivities() {
    return this.form?.activities?.filter((a: any) => a.activityType === 'LABORAL') || [];
  }

  get extralaboralActivities() {
    return this.form?.activities?.filter((a: any) => a.activityType === 'EXTRALABORAL') || [];
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
      case 'ANUAL': factor = 1; break;
    }
    return activity.timeValue * factor;
  }

  calculateTime(activity: any, unit: string): number {
    const annual = this.calculateAnnualTime(activity);
    switch (unit) {
      case 'DIA': return annual / (5 * 4.3 * 12);
      case 'SEMANA': return annual / (4.3 * 12);
      case 'QUINCENA': return annual / (2 * 12);
      case 'MES': return annual / 12;
      case 'TRIMESTRE': return annual / 4;
      case 'SEMESTRE': return annual / 2;
      case 'ANUAL': return annual;
      default: return 0;
    }
  }

  getTotalMinutes(type: 'LABORAL' | 'EXTRALABORAL', unit: string): number {
    const activities = type === 'LABORAL' ? this.laboralActivities : this.extralaboralActivities;
    return activities.reduce((acc: number, curr: any) => acc + this.calculateTime(curr, unit), 0);
  }

  formatHours(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  updateChartData() {
    if (!this.form?.activities) return;

    // Laboral Chart
    const laboralLabels = this.laboralActivities.map((a: any) => a.description);
    const laboralData = this.laboralActivities.map((a: any) => this.calculateAnnualTime(a) / 60);
    this.laboralChartData = {
      labels: laboralLabels,
      datasets: [{ data: laboralData, backgroundColor: this.warmColors }]
    };

    // Extralaboral Chart
    const extralaboralLabels = this.extralaboralActivities.map((a: any) => a.description);
    const extralaboralData = this.extralaboralActivities.map((a: any) => this.calculateAnnualTime(a) / 60);
    this.extralaboralChartData = {
      labels: extralaboralLabels,
      datasets: [{ data: extralaboralData, backgroundColor: this.warmColors }]
    };

    // Frequency Unit Chart
    const timeByUnit: { [key: string]: number } = {};
    this.form.activities.forEach((activity: any) => {
      const unit = activity.timeUnit || 'Sin Unidad';
      const hours = this.calculateAnnualTime(activity) / 60;
      timeByUnit[unit] = (timeByUnit[unit] || 0) + hours;
    });

    this.frequencyUnitChartData = {
      labels: Object.keys(timeByUnit),
      datasets: [{ data: Object.values(timeByUnit), backgroundColor: this.warmColors }]
    };
  }

  // Percentage Calculations
  // Calculate percentage of time for an activity within its frequency group
  getPercentageInFrequencyGroup(activity: any, type: 'LABORAL' | 'EXTRALABORAL'): number {
    const total = this.getFrequencyGroupTotal(activity.timeUnit, type);
    if (total === 0) return 0;
    const activityTime = this.calculateAnnualTime(activity);
    return (activityTime / total) * 100;
  }

  // Get total time for all activities in a specific frequency group
  getFrequencyGroupTotal(timeUnit: string, type: 'LABORAL' | 'EXTRALABORAL'): number {
    const activities = type === 'LABORAL' ? this.laboralActivities : this.extralaboralActivities;
    return activities
      .filter((a: any) => a.timeUnit === timeUnit)
      .reduce((sum: number, a: any) => sum + this.calculateAnnualTime(a), 0);
  }

  // Get all unique frequency units for a type
  getUniqueFrequencyUnits(type: 'LABORAL' | 'EXTRALABORAL'): string[] {
    const activities = type === 'LABORAL' ? this.laboralActivities : this.extralaboralActivities;
    const units = activities.map((a: any) => a.timeUnit as string).filter((u: string) => u);
    return Array.from(new Set<string>(units));
  }

  // Get activities by frequency unit
  getActivitiesByFrequency(timeUnit: string, type: 'LABORAL' | 'EXTRALABORAL'): any[] {
    const activities = type === 'LABORAL' ? this.laboralActivities : this.extralaboralActivities;
    return activities.filter((a: any) => a.timeUnit === timeUnit);
  }

  // Calculate overall percentage distribution across all frequencies
  getOverallFrequencyPercentages(): { unit: string, percentage: number, hours: number }[] {
    const allActivities = [...this.laboralActivities, ...this.extralaboralActivities];
    const totalAnnualTime = allActivities.reduce((sum: number, a: any) => sum + this.calculateAnnualTime(a), 0);

    const frequencyTotals: { [key: string]: number } = {};
    allActivities.forEach((activity: any) => {
      const unit = activity.timeUnit || 'Sin Unidad';
      const time = this.calculateAnnualTime(activity);
      frequencyTotals[unit] = (frequencyTotals[unit] || 0) + time;
    });

    return Object.entries(frequencyTotals).map(([unit, time]) => ({
      unit,
      hours: time / 60,
      percentage: totalAnnualTime > 0 ? (time / totalAnnualTime) * 100 : 0
    }));
  }
}
