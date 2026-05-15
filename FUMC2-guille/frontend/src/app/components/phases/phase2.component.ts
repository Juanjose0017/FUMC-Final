import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-phase2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phase2.component.html',
  styleUrls: ['./phase2.component.css']
})
export class Phase2Component {
  @Input() form: any;
  @Output() onUpdateActivity = new EventEmitter<any>();

  get laboralActivities() {
    return this.form?.activities?.filter((a: any) => a.activityType === 'LABORAL') || [];
  }

  get extralaboralActivities() {
    return this.form?.activities?.filter((a: any) => a.activityType === 'EXTRALABORAL') || [];
  }

  updateActivity(activity: any) {
    this.onUpdateActivity.emit(activity);
  }

  trackByActivityId(index: number, activity: any): number {
    return activity.id;
  }
}
