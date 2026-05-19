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
  templateUrl: './phase5.component.html',
  styleUrls: ['./phase5.component.css']
})
export class Phase5Component implements OnChanges {
  @Input() form: any;

  // Tab state
  currentTab: 'resumen' | 'porcentajes' | 'graficos' | 'detalle' = 'resumen';

  setTab(tab: 'resumen' | 'porcentajes' | 'graficos' | 'detalle') {
    this.currentTab = tab;
  }

  private warmColors = [
    '#FF6B6B', '#FFD93D', '#FF8E3C', '#FF5252', '#E040FB',
    '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
    '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFAB00'
  ];

  public barChartOptions: ChartConfiguration['options'] | any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Horas Anuales' }
      }
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value: any) => {
          if (value === 0) return '';
          return value.toFixed(1) + 'h';
        },
        color: '#4a5568',
        font: { weight: 'bold', size: 11 }
      }
    }
  };

  public laboralChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Horas' }] };
  public extralaboralChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Horas' }] };
  public frequencyUnitChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Horas' }] };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['form'] && this.form) {
      this.updateChartData();
    }
  }

  // ─── Getters de actividades ───────────────────────────────────────────────

  get laboralActivities() {
    return this.form?.activities?.filter((a: any) => a.activityType === 'LABORAL') || [];
  }

  get extralaboralActivities() {
    return this.form?.activities?.filter((a: any) => a.activityType === 'EXTRALABORAL') || [];
  }

  // ─── Prioridad ────────────────────────────────────────────────────────────

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

  // ─── Cálculos de tiempo ───────────────────────────────────────────────────

  calculateAnnualTime(activity: any): number {
    if (activity.timeValue === undefined || !activity.timeUnit) return 0;
    let factor = 0;
    switch (activity.timeUnit) {
      case 'DIA':      factor = 5 * 4.3 * 12; break;
      case 'SEMANA':   factor = 4.3 * 12;      break;
      case 'QUINCENA': factor = 2 * 12;         break;
      case 'MES':      factor = 12;             break;
      case 'TRIMESTRE':factor = 4;              break;
      case 'SEMESTRE': factor = 2;              break;
      case 'ANIO':
      case 'AÑO':
      case 'ANUAL':    factor = 1;              break;
    }
    return activity.timeValue * factor;
  }

  calculateTime(activity: any, unit: string): number {
    const annual = this.calculateAnnualTime(activity);
    switch (unit) {
      case 'DIA':      return annual / (5 * 4.3 * 12);
      case 'SEMANA':   return annual / (4.3 * 12);
      case 'QUINCENA': return annual / (2 * 12);
      case 'MES':      return annual / 12;
      case 'TRIMESTRE':return annual / 4;
      case 'SEMESTRE': return annual / 2;
      case 'ANUAL':    return annual;
      default:         return 0;
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

  // ─── Análisis de carga semanal (LABORALES) ────────────────────────────────

  /** Total de horas semanales de las actividades LABORALES */
  get totalLaboralWeeklyHours(): number {
    return this.getTotalMinutes('LABORAL', 'SEMANA') / 60;
  }

  /** Límite semanal laboral definido en Fase 1 */
  get weeklyWorkLimit(): number {
    return this.form?.weeklyWorkHours || 0;
  }

  /** Horas laborales que superan el límite semanal */
  get laboralOverflowHours(): number {
    const overflow = this.totalLaboralWeeklyHours - this.weeklyWorkLimit;
    return overflow > 0 ? overflow : 0;
  }

  get hasLaboralOverflow(): boolean {
    return this.weeklyWorkLimit > 0 && this.laboralOverflowHours > 0;
  }

  /** Porcentaje de uso del cupo laboral (máx 100 para la barra) */
  get laboralUsagePercent(): number {
    if (this.weeklyWorkLimit === 0) return 0;
    return Math.min((this.totalLaboralWeeklyHours / this.weeklyWorkLimit) * 100, 100);
  }

  // ─── Análisis de carga semanal (EXTRALABORALES) ──────────────────────────

  /** Total de horas semanales de las actividades EXTRALABORALES */
  get totalExtralaboralWeeklyHours(): number {
    return this.getTotalMinutes('EXTRALABORAL', 'SEMANA') / 60;
  }

  /** Límite semanal extralaboral definido en Fase 1 */
  get weeklyExtraLimit(): number {
    return this.form?.weeklyExtraHours || 0;
  }

  /** Horas extralaborales que superan el límite semanal */
  get extralaboralOverflowHours(): number {
    const overflow = this.totalExtralaboralWeeklyHours - this.weeklyExtraLimit;
    return overflow > 0 ? overflow : 0;
  }

  get hasExtralaboralOverflow(): boolean {
    return this.weeklyExtraLimit > 0 && this.extralaboralOverflowHours > 0;
  }

  /** Porcentaje de uso del cupo extralaboral (máx 100 para la barra) */
  get extralaboralUsagePercent(): number {
    if (this.weeklyExtraLimit === 0) return 0;
    return Math.min((this.totalExtralaboralWeeklyHours / this.weeklyExtraLimit) * 100, 100);
  }

  // ─── Actividades con marcado de desbordamiento ────────────────────────────

  /**
   * Retorna las actividades LABORALES marcando cuáles forman parte del
   * exceso una vez que la suma acumulada supera el límite semanal.
   */
  get laboralActivitiesWithOverflow(): { activity: any; weeklyHours: number; isOverflow: boolean }[] {
    const limit = this.weeklyWorkLimit;
    let accumulated = 0;
    return this.laboralActivities.map((a: any) => {
      const wh = this.calculateTime(a, 'SEMANA') / 60;
      accumulated += wh;
      return { activity: a, weeklyHours: wh, isOverflow: limit > 0 && accumulated > limit };
    });
  }

  /**
   * Retorna las actividades EXTRALABORALES marcando las del exceso.
   */
  get extralaboralActivitiesWithOverflow(): { activity: any; weeklyHours: number; isOverflow: boolean }[] {
    const limit = this.weeklyExtraLimit;
    let accumulated = 0;
    return this.extralaboralActivities.map((a: any) => {
      const wh = this.calculateTime(a, 'SEMANA') / 60;
      accumulated += wh;
      return { activity: a, weeklyHours: wh, isOverflow: limit > 0 && accumulated > limit };
    });
  }

  // ─── Gráficos ─────────────────────────────────────────────────────────────

  updateChartData() {
    if (!this.form?.activities) return;

    const laboralLabels = this.laboralActivities.map((a: any) => a.description);
    const laboralData   = this.laboralActivities.map((a: any) => this.calculateAnnualTime(a) / 60);
    this.laboralChartData = {
      labels: laboralLabels,
      datasets: [{ label: 'Horas Anuales', data: laboralData, backgroundColor: this.warmColors }]
    };

    const extralaboralLabels = this.extralaboralActivities.map((a: any) => a.description);
    const extralaboralData   = this.extralaboralActivities.map((a: any) => this.calculateAnnualTime(a) / 60);
    this.extralaboralChartData = {
      labels: extralaboralLabels,
      datasets: [{ label: 'Horas Anuales', data: extralaboralData, backgroundColor: this.warmColors }]
    };

    const timeByUnit: { [key: string]: number } = {};
    this.form.activities.forEach((activity: any) => {
      const unit  = activity.timeUnit || 'Sin Unidad';
      const hours = this.calculateAnnualTime(activity) / 60;
      timeByUnit[unit] = (timeByUnit[unit] || 0) + hours;
    });

    this.frequencyUnitChartData = {
      labels: Object.keys(timeByUnit),
      datasets: [{ label: 'Horas Anuales', data: Object.values(timeByUnit), backgroundColor: this.warmColors }]
    };
  }

  // ─── Porcentajes ──────────────────────────────────────────────────────────

  getPercentageInFrequencyGroup(activity: any, type: 'LABORAL' | 'EXTRALABORAL'): number {
    const total = this.getFrequencyGroupTotal(activity.timeUnit, type);
    if (total === 0) return 0;
    return (this.calculateAnnualTime(activity) / total) * 100;
  }

  getFrequencyGroupTotal(timeUnit: string, type: 'LABORAL' | 'EXTRALABORAL'): number {
    const activities = type === 'LABORAL' ? this.laboralActivities : this.extralaboralActivities;
    return activities
      .filter((a: any) => a.timeUnit === timeUnit)
      .reduce((sum: number, a: any) => sum + this.calculateAnnualTime(a), 0);
  }

  getUniqueFrequencyUnits(type: 'LABORAL' | 'EXTRALABORAL'): string[] {
    const activities = type === 'LABORAL' ? this.laboralActivities : this.extralaboralActivities;
    const units = activities.map((a: any) => a.timeUnit as string).filter((u: string) => u);
    return Array.from(new Set<string>(units));
  }

  getActivitiesByFrequency(timeUnit: string, type: 'LABORAL' | 'EXTRALABORAL'): any[] {
    const activities = type === 'LABORAL' ? this.laboralActivities : this.extralaboralActivities;
    return activities.filter((a: any) => a.timeUnit === timeUnit);
  }

  getOverallFrequencyPercentages(): { unit: string; percentage: number; hours: number }[] {
    const allActivities  = [...this.laboralActivities, ...this.extralaboralActivities];
    const totalAnnualTime = allActivities.reduce((sum: number, a: any) => sum + this.calculateAnnualTime(a), 0);

    const frequencyTotals: { [key: string]: number } = {};
    allActivities.forEach((activity: any) => {
      const unit = activity.timeUnit || 'Sin Unidad';
      frequencyTotals[unit] = (frequencyTotals[unit] || 0) + this.calculateAnnualTime(activity);
    });

    return Object.entries(frequencyTotals).map(([unit, time]) => ({
      unit,
      hours: time / 60,
      percentage: totalAnnualTime > 0 ? (time / totalAnnualTime) * 100 : 0
    }));
  }

  // ─── Detalle Completo ────────────────────────────────────────────────────

  activeFilterType: 'TODAS' | 'LABORAL' | 'EXTRALABORAL' = 'TODAS';
  activeFilterPriority: 'TODAS' | 'ALTA' | 'MEDIA' | 'BAJA' = 'TODAS';

  getFilteredActivities(): any[] {
    let activities = [...this.laboralActivities, ...this.extralaboralActivities];
    if (this.activeFilterType !== 'TODAS') {
      activities = activities.filter(a => a.activityType === this.activeFilterType);
    }
    if (this.activeFilterPriority !== 'TODAS') {
      activities = activities.filter(a => {
        const label = this.getPriorityLabel(a.priorityScore || 0).toUpperCase();
        return label === this.activeFilterPriority;
      });
    }
    return activities;
  }

  setFilterType(type: 'TODAS' | 'LABORAL' | 'EXTRALABORAL') { this.activeFilterType = type; }
  setFilterPriority(priority: 'TODAS' | 'ALTA' | 'MEDIA' | 'BAJA') { this.activeFilterPriority = priority; }

  getTotalAnnualTimeAll(): number {
    const all = [...this.laboralActivities, ...this.extralaboralActivities];
    return all.reduce((sum, a) => sum + this.calculateAnnualTime(a), 0);
  }

  getActivityImpactPercentage(activity: any): number {
    const total = this.getTotalAnnualTimeAll();
    if (total === 0) return 0;
    return (this.calculateAnnualTime(activity) / total) * 100;
  }

  // ─── Impresión ────────────────────────────────────────────────────────────

  printReport() {
    const laboral     = this.laboralActivities;
    const extralaboral = this.extralaboralActivities;
    const all          = [...laboral, ...extralaboral];
    const totalAllMin  = this.getTotalAnnualTimeAll();

    const priorityStyle = (score: number) => {
      const label = this.getPriorityLabel(score);
      const bg    = label === 'Alta' ? '#fee2e2' : label === 'Media' ? '#fef3c7' : '#dcfce7';
      const color = label === 'Alta' ? '#b91c1c' : label === 'Media' ? '#b45309' : '#15803d';
      return { label, bg, color };
    };

    const buildRows = (activities: any[]) => activities.map(a => {
      const annualMin = this.calculateAnnualTime(a);
      const annualHrs = (annualMin / 60).toFixed(1);
      const impact    = totalAllMin > 0 ? ((annualMin / totalAllMin) * 100).toFixed(1) : '0.0';
      const p         = priorityStyle(a.priorityScore || 0);
      const barFill   = `width:${impact}%;height:8px;background:linear-gradient(90deg,#f59e0b,#ef4444);border-radius:4px;`;
      return `<tr>
        <td>${a.description}</td>
        <td style="text-align:center">${a.frequency || 0}</td>
        <td style="text-align:center">${a.timeUnit || '-'}</td>
        <td style="text-align:center">${a.timeValue || 0} min</td>
        <td style="text-align:center">${a.importance || 0} / ${a.coherence || 0} / ${a.relevance || 0}</td>
        <td style="text-align:center"><span style="background:${p.bg};color:${p.color};padding:2px 8px;border-radius:9px;font-weight:700;font-size:9px;">${p.label}</span></td>
        <td style="text-align:center"><strong>${annualHrs} hrs</strong></td>
        <td>
          <div style="display:flex;align-items:center;gap:6px;">
            <div style="flex:1;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;"><div style="${barFill}"></div></div>
            <span style="font-weight:700;font-size:10px;min-width:36px;text-align:right">${impact}%</span>
          </div>
        </td>
      </tr>`;
    }).join('');

    const buildSection = (title: string, activities: any[], accentColor: string) => {
      if (activities.length === 0) return '';
      const totalMin = activities.reduce((s, a) => s + this.calculateAnnualTime(a), 0);
      const totalHrs = (totalMin / 60).toFixed(1);
      return `
        <h3 style="margin:1.5rem 0 0.5rem;color:${accentColor};border-bottom:2px solid ${accentColor};padding-bottom:5px;font-size:13px;">${title}</h3>
        <table>
          <thead><tr>
            <th style="width:28%">Actividad</th>
            <th>Frec.</th><th>Unidad</th><th>T. Base</th>
            <th>Imp/Coh/Rel</th><th>Prioridad</th>
            <th>Hrs Anuales</th><th style="width:18%">Impacto Total</th>
          </tr></thead>
          <tbody>${buildRows(activities)}</tbody>
          <tfoot><tr>
            <td colspan="6" style="text-align:right;font-weight:700;">TOTAL ${title.toUpperCase()}:</td>
            <td style="font-weight:800;font-size:12px;">${totalHrs} hrs</td>
            <td></td>
          </tr></tfoot>
        </table>`;
    };

    const logoUrl = window.location.origin + '/assets/logo.png';
    const dateStr = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' });

    // Sección de alerta de desbordamiento para el reporte impreso
    const overflowSection = (this.hasLaboralOverflow || this.hasExtralaboralOverflow) ? `
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:0.75rem 1rem;margin-bottom:1rem;font-size:10px;">
        <strong style="color:#c2410c;">⚠ Análisis de Carga Horaria</strong>
        ${this.hasLaboralOverflow ? `<p style="margin:4px 0;color:#9a3412;">Horas laborales: <strong>${this.totalLaboralWeeklyHours.toFixed(1)} hrs/sem</strong> — Límite: ${this.weeklyWorkLimit} hrs — Exceso: <strong>${this.laboralOverflowHours.toFixed(1)} hrs/sem</strong></p>` : ''}
        ${this.hasExtralaboralOverflow ? `<p style="margin:4px 0;color:#7e22ce;">Horas extralaborales: <strong>${this.totalExtralaboralWeeklyHours.toFixed(1)} hrs/sem</strong> — Límite: ${this.weeklyExtraLimit} hrs — Exceso: <strong>${this.extralaboralOverflowHours.toFixed(1)} hrs/sem</strong></p>` : ''}
      </div>` : '';

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte Evaluación de Desempeño</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#111827;background:white;padding:1.5rem 2rem}
    .rh{display:flex;align-items:center;gap:1.2rem;border-bottom:3px solid #003d7a;padding-bottom:1rem;margin-bottom:1.2rem}
    .rh img{height:60px;width:60px;object-fit:contain}
    .rh h1{font-size:17px;color:#003d7a;margin-bottom:3px}
    .meta{display:flex;flex-wrap:wrap;gap:3px 20px;font-size:10px;color:#374151}
    .meta strong{color:#003d7a}
    .boxes{display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-bottom:1.2rem}
    .box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:0.65rem 0.8rem;text-align:center}
    .box .lbl{font-size:9px;font-weight:700;text-transform:uppercase;color:#6b7280;margin-bottom:3px}
    .box .val{font-size:16px;font-weight:800;color:#003d7a}
    .box .sub{font-size:8px;color:#9ca3af;margin-top:2px}
    table{width:100%;border-collapse:collapse;margin-bottom:0.5rem;font-size:10px}
    thead tr{background:#003d7a;color:white}
    thead th{padding:5px 6px;text-align:left;font-weight:600;font-size:9.5px}
    tbody tr:nth-child(even){background:#f8fafc}
    tbody td{padding:5px 6px;border-bottom:1px solid #e5e7eb;vertical-align:middle}
    tfoot td{padding:5px 6px;background:#dbeafe;font-size:10.5px}
    .foot{margin-top:1.5rem;border-top:1px solid #e5e7eb;padding-top:0.75rem;font-size:8.5px;color:#9ca3af;display:flex;justify-content:space-between}
    @page{size:A4 landscape;margin:1cm}
    @media print{body{padding:0.5rem}}
  </style>
</head>
<body>
  <div class="rh">
    <img src="${logoUrl}" alt="Logo" onerror="this.style.display='none'">
    <div>
      <h1>Evaluación de Desempeño ${this.form?.year || ''} &nbsp;<span style="font-size:12px;color:#6b7280;font-weight:400">#${String(this.form?.id || '').padStart(5,'0')}</span></h1>
      <div class="meta">
        <span><strong>Empresa:</strong> ${this.form?.empresa || '-'}</span>
        <span><strong>Área:</strong> ${this.form?.area || '-'}</span>
        <span><strong>Proceso:</strong> ${this.form?.proceso || '-'}</span>
        <span><strong>Líder:</strong> ${this.form?.lider || '-'}</span>
        <span><strong>Cargo:</strong> ${this.form?.cargo || '-'}</span>
        <span><strong>Período:</strong> ${this.form?.fechaInicio || ''} — ${this.form?.fechaFin || ''}</span>
        <span><strong>Generado:</strong> ${dateStr}</span>
      </div>
    </div>
  </div>

  <div class="boxes">
    <div class="box">
      <div class="lbl">Total Actividades</div>
      <div class="val">${all.length}</div>
      <div class="sub">${laboral.length} lab · ${extralaboral.length} extralab</div>
    </div>
    <div class="box">
      <div class="lbl">Horas Anuales</div>
      <div class="val">${(totalAllMin / 60).toFixed(1)}</div>
      <div class="sub">${totalAllMin.toFixed(0)} minutos totales</div>
    </div>
    <div class="box">
      <div class="lbl">Horas Lab. Anuales</div>
      <div class="val">${(this.getTotalMinutes('LABORAL', 'ANUAL') / 60).toFixed(1)}</div>
      <div class="sub">Actividades Laborales</div>
    </div>
    <div class="box">
      <div class="lbl">Horas Extralab. Anuales</div>
      <div class="val">${(this.getTotalMinutes('EXTRALABORAL', 'ANUAL') / 60).toFixed(1)}</div>
      <div class="sub">Actividades Extralaborales</div>
    </div>
  </div>

  ${overflowSection}
  ${buildSection('Actividades Laborales', laboral, '#1e40af')}
  ${buildSection('Actividades Extralaborales', extralaboral, '#7e22ce')}

  <div class="foot">
    <span>Fundación Universitaria María Cano — Sistema de Gestión de Rendimiento</span>
    <span>Fase 5 completada · Documento generado automáticamente · ${dateStr}</span>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=1200,height=850');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 700);
    }
  }
}
