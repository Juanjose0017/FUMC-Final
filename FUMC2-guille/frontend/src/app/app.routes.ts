import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormContainerComponent } from './components/form-container/form-container.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { superAdminGuard } from './guards/super-admin.guard';

import { RegisterComponent } from './components/register/register.component';

import { ReportsComponent } from './components/reports/reports.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', loadComponent: () => import('./components/login/forgot-password.component').then(m => m.ForgotPasswordComponent) },

    // Regular user dashboard
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

    // Admin routes - all require admin/lider access
    {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'formats', component: DashboardComponent, canActivate: [superAdminGuard] },
            { path: 'users', component: DashboardComponent, canActivate: [superAdminGuard] },
            { path: 'processes', component: DashboardComponent },
            { path: 'tokens', component: DashboardComponent, canActivate: [superAdminGuard] },
            { path: 'reports', component: DashboardComponent }
        ]
    },

    // Form view/edit
    { path: 'form/:id', component: FormContainerComponent, canActivate: [authGuard] },

    // Legacy reports route
    { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
