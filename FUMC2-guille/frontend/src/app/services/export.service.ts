import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    constructor() { }

    /**
     * Export form data to PDF (Exact Visual Copy)
     */
    exportToPDF(element: HTMLElement, fileName: string): void {
        // Capture the full scrollable content
        html2canvas(element, {
            scale: 2,
            width: element.scrollWidth,
            height: element.scrollHeight,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(fileName + '.pdf');
        });
    }

    /**
     * Export form data to Excel (XLSX)
     */
    exportToExcel(formData: any, userName: string): void {
        const workbook = XLSX.utils.book_new();

        // General Info Sheet
        const generalInfo = [
            ['Gestión del Rendimiento - FUMC'],
            [''],
            ['Usuario', userName],
            ['Año', formData.year],
            ['Área', formData.area || 'N/A'],
            ['Proceso', formData.proceso || 'N/A'],
            ['Fase Actual', formData.currentPhase],
            ['Fecha Inicio', formData.fechaInicio ? this.formatDate(formData.fechaInicio) : 'N/A']
        ];

        const wsGeneral = XLSX.utils.aoa_to_sheet(generalInfo);
        XLSX.utils.book_append_sheet(workbook, wsGeneral, 'Información General');

        // Activities Sheet
        if (formData.activities && formData.activities.length > 0) {
            const activityHeaders = [
                'Descripción',
                'Tipo',
                'Frecuencia',
                'Unidad Tiempo',
                'Valor Tiempo',
                'Prioridad'
            ];

            const activityData = formData.activities.map((activity: any) => [
                activity.description || '',
                activity.activityType || '',
                activity.frequency || '',
                activity.timeUnit || '',
                activity.timeValue || '',
                activity.priorityScore ? activity.priorityScore.toFixed(2) : ''
            ]);

            const wsActivities = XLSX.utils.aoa_to_sheet([activityHeaders, ...activityData]);
            XLSX.utils.book_append_sheet(workbook, wsActivities, 'Actividades');
        }

        // Save Excel file
        const fileName = `Formulario_${userName.replace(/\s+/g, '_')}_${formData.year}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    }

    /**
     * Format date to DD/MM/YYYY
     */
    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}
