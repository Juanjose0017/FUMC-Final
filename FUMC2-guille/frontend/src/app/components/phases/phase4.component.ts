import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-phase4',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './phase4.component.html',
  styleUrls: ['./phase4.component.css']
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

    trackByActivityId(index: number, activity: any): number {
        return activity.id;
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

    activeTooltip: string | null = null;

    toggleTooltip(type: string, event: Event) {
        event.stopPropagation();
        if (this.activeTooltip === type) {
            this.activeTooltip = null;
        } else {
            this.activeTooltip = type;
        }
    }

    closeTooltip() {
        this.activeTooltip = null;
    }

    // ─── Análisis de carga semanal ────────────────────────────────────────────

    /** Convierte timeValue (min/ocurrencia) a horas/semana según la frecuencia */
    getWeeklyHours(activity: any): number {
        if (!activity.timeValue || !activity.timeUnit) return 0;
        const min = Number(activity.timeValue);
        let occPerWeek = 0;
        switch (activity.timeUnit) {
            case 'DIA':       occPerWeek = 5;               break;
            case 'SEMANA':    occPerWeek = 1;               break;
            case 'QUINCENA':  occPerWeek = 1 / 2;          break;
            case 'MES':       occPerWeek = 1 / 4.3;        break;
            case 'TRIMESTRE': occPerWeek = 1 / (4.3 * 3);  break;
            case 'SEMESTRE':  occPerWeek = 1 / (4.3 * 6);  break;
            case 'ANIO':
            case 'AÑO':
            case 'ANUAL':     occPerWeek = 1 / (4.3 * 12); break;
        }
        return (min * occPerWeek) / 60;
    }

    get totalLaboralWeeklyHours(): number {
        return this.laboralActivities.reduce((s: number, a: any) => s + this.getWeeklyHours(a), 0);
    }

    get totalExtralaboralWeeklyHours(): number {
        return this.extralaboralActivities.reduce((s: number, a: any) => s + this.getWeeklyHours(a), 0);
    }

    get weeklyWorkLimit(): number   { return this.form?.weeklyWorkHours  || 0; }
    get weeklyExtraLimit(): number  { return this.form?.weeklyExtraHours || 0; }

    /** Horas por día laboral = weeklyWorkHours / 5 días */
    get dailyHoursLimit(): number {
        return this.weeklyWorkLimit > 0 ? this.weeklyWorkLimit / 5 : 0;
    }

    /**
     * ¿Esta actividad DIA supera las horas diarias permitidas?
     * Solo aplica si la frecuencia es DIA.
     */
    isDailyOverflow(activity: any): boolean {
        if (activity.timeUnit !== 'DIA' || this.dailyHoursLimit === 0) return false;
        return Number(activity.timeValue) > this.dailyHoursLimit * 60;
    }

    get laboralOverflow(): number {
        const d = this.totalLaboralWeeklyHours - this.weeklyWorkLimit;
        return d > 0 ? d : 0;
    }

    get extralaboralOverflow(): number {
        const d = this.totalExtralaboralWeeklyHours - this.weeklyExtraLimit;
        return d > 0 ? d : 0;
    }

    get laboralUsagePercent(): number {
        if (this.weeklyWorkLimit === 0) return 0;
        return Math.min((this.totalLaboralWeeklyHours / this.weeklyWorkLimit) * 100, 100);
    }

    get extralaboralUsagePercent(): number {
        if (this.weeklyExtraLimit === 0) return 0;
        return Math.min((this.totalExtralaboralWeeklyHours / this.weeklyExtraLimit) * 100, 100);
    }

    /** ¿Esta actividad laboral, acumulada, supera el límite? */
    isLaboralOverflow(activity: any): boolean {
        if (this.weeklyWorkLimit === 0) return false;
        let acc = 0;
        for (const a of this.laboralActivities) {
            acc += this.getWeeklyHours(a);
            if (a.id === activity.id) break;
        }
        return acc > this.weeklyWorkLimit;
    }

    /** ¿Esta actividad extralaboral, acumulada, supera el límite? */
    isExtralaboralOverflow(activity: any): boolean {
        if (this.weeklyExtraLimit === 0) return false;
        let acc = 0;
        for (const a of this.extralaboralActivities) {
            acc += this.getWeeklyHours(a);
            if (a.id === activity.id) break;
        }
        return acc > this.weeklyExtraLimit;
    }
}

