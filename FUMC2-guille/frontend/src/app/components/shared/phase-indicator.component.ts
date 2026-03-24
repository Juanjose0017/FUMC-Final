import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-phase-indicator',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="phase-indicator" [style.background-color]="getPhaseColor()">
      <span class="phase-label">Fase {{ currentPhase }}</span>
    </div>
  `,
    styles: [`
    .phase-indicator {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      color: white;
      font-weight: bold;
      font-size: 0.9rem;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .phase-indicator:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    }

    .phase-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
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
