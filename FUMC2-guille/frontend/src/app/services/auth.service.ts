import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/api/auth`;
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUserSubject.next(JSON.parse(storedUser));
        }
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((user: any) => {
                localStorage.setItem('token', user.accessToken);
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            })
        );
    }

    register(user: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, user);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/users`, { headers: this.getHeaders() });
    }

    updateUserRole(userId: number, role: string): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/api/users/${userId}/role`, { role }, { headers: this.getHeaders() });
    }


    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/api/users/${userId}`, { headers: this.getHeaders() });
    }

    // Registration Token Management
    generateRegistrationToken(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/api/admin/tokens/generate`, {}, { headers: this.getHeaders() });
    }

    getRegistrationTokens(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/api/admin/tokens`, { headers: this.getHeaders() });
    }

    deleteRegistrationToken(tokenId: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/api/admin/tokens/${tokenId}`, { headers: this.getHeaders() });
    }

    private getHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    requestPasswordReset(contact: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/request-password-reset`, { contact });
    }

    resetPassword(code: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, { code, newPassword });
    }
}
