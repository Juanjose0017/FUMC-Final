import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Process {
    id?: number;
    name: string;
    description?: string;
    active?: boolean;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProcessService {
    private apiUrl = `${environment.apiUrl}/api/processes`;

    constructor(private http: HttpClient) { }

    getAllProcesses(): Observable<Process[]> {
        return this.http.get<Process[]>(this.apiUrl);
    }

    getActiveProcesses(): Observable<Process[]> {
        return this.http.get<Process[]>(`${this.apiUrl}/active`);
    }

    getProcessById(id: number): Observable<Process> {
        return this.http.get<Process>(`${this.apiUrl}/${id}`);
    }

    createProcess(process: Process): Observable<Process> {
        return this.http.post<Process>(this.apiUrl, process);
    }

    updateProcess(id: number, process: Process): Observable<Process> {
        return this.http.put<Process>(`${this.apiUrl}/${id}`, process);
    }

    deleteProcess(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
