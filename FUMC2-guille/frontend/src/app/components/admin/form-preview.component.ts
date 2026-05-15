import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpanishDatePipe } from '../../pipes/spanish-date.pipe';
import { ExportService } from '../../services/export.service';
import { Phase5Component } from '../phases/phase5.component';

@Component({
  selector: 'app-form-preview',
  standalone: true,
  imports: [CommonModule, SpanishDatePipe, Phase5Component],
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.css']
})
export class FormPreviewComponent {
  @Input() formData: any;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('modalBody') modalBody!: ElementRef;

  constructor(private exportService: ExportService) { }

  getUserName(): string {
    if (!this.formData?.user) return 'N/A';
    return `${this.formData.user.firstName} ${this.formData.user.firstLastName}`;
  }

  close(): void {
    this.closeModal.emit();
  }

  exportPDF(): void {
    if (this.formData && this.modalBody) {
      const userName = this.getUserName();

      this.exportService.exportToPDF(
        this.modalBody.nativeElement,
        `Formulario_${userName.replace(/\s+/g, '_')}`
      );
    }
  }
}
