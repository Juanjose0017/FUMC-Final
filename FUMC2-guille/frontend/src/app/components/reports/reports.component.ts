import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormService } from '../../services/form.service';
import { RouterModule } from '@angular/router';
import { SpanishDatePipe } from '../../pipes/spanish-date.pipe';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, SpanishDatePipe],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
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
