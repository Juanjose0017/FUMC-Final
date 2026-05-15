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
}
