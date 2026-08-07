import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FormService {
    private apiUrl = `${environment.apiUrl}/api/forms`;

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    getForms(userId: number, page: number = 0, size: number = 8, filter?: string): Observable<any> {
        let url = `${this.apiUrl}/user/${userId}?page=${page}&size=${size}`;
        if (filter) {
            url += `&filter=${filter}`;
        }
        return this.http.get<any>(url, { headers: this.getHeaders() });
    }

    getForm(id: number, userId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}/user/${userId}`, { headers: this.getHeaders() });
    }

    createForm(form: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, form, { headers: this.getHeaders() });
    }

    updateHeader(id: number, form: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}/header`, form, { headers: this.getHeaders() });
    }

    addActivity(id: number, activity: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/activities`, activity, { headers: this.getHeaders() });
    }

    deleteActivity(activityId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/activities/${activityId}`, { headers: this.getHeaders() });
    }

    updateActivity(activityId: number, activity: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/activities/${activityId}`, activity, { headers: this.getHeaders() });
    }

    advancePhase(id: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/advance`, {}, { headers: this.getHeaders() });
    }

    regressPhase(id: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/regress`, {}, { headers: this.getHeaders() });
    }

    unlockForm(id: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/unlock`, {}, { headers: this.getHeaders() });
    }

    getConsolidatedReports(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/consolidated`, { headers: this.getHeaders() });
    }

    getCompletedForms(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/completed`, { headers: this.getHeaders() });
    }

    deleteForm(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders(),
            responseType: 'text' as 'json'
        });
    }

    // Deleted forms management
    getDeletedForms(page: number = 0, size: number = 8): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/deleted?page=${page}&size=${size}`, { headers: this.getHeaders() });
    }

    restoreForm(id: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${id}/restore`, {}, { headers: this.getHeaders() });
    }

    permanentlyDeleteForm(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}/permanent`, {
            headers: this.getHeaders(),
            responseType: 'text' as 'json'
        });
    }
}
