import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-phase-indicator',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './phase-indicator.component.html',
  styleUrls: ['./phase-indicator.component.css']
})
export class PhaseIndicatorComponent {
    @Input() currentPhase: number = 1;

    getPhaseColor(): string {
        const colors: { [key: number]: string } = {
            1: '#0056b3',  // Blue
            2: '#198754',  // Green
            3: '#fd7e14',  // Orange
            4: '#6f42c1',  // Purple
            5: '#d63384'   // Fuchsia
        };
        return colors[this.currentPhase] || '#6c757d';
    }
}
