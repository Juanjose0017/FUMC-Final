import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-phase3',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './phase3.component.html',
  styleUrls: ['./phase3.component.css']
})
export class Phase3Component {
    @Input() form: any;
    @Output() onUpdateActivity = new EventEmitter<any>();

    get laboralActivities() {
        return this.form?.activities?.filter((a: any) => a.activityType === 'LABORAL') || [];
    }

    get extralaboralActivities() {
        return this.form?.activities?.filter((a: any) => a.activityType === 'EXTRALABORAL') || [];
    }

    updateActivity(activity: any) {
        activity.priorityScore = this.calculatePriority(activity);
        this.onUpdateActivity.emit(activity);
    }

    calculatePriority(activity: any): number {
        const imp = activity.importance || 0;
        const coh = activity.coherence || 0;
        const rel = activity.relevance || 0;
        return (imp * 0.5) + (coh * 0.3) + (rel * 0.2);
    }

    validateScore(activity: any, field: string) {
        if (activity[field] > 10) {
            activity[field] = 10;
        } else if (activity[field] < 0) {
            activity[field] = 0;
        }
        this.updateActivity(activity);
    }

    trackByActivityId(index: number, activity: any): number {
        return activity.id;
    }
}
