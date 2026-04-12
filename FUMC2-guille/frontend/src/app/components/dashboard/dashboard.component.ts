import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { PhaseIndicatorComponent } from '../shared/phase-indicator.component';
import { SpanishDatePipe } from '../../pipes/spanish-date.pipe';
import { RoleTranslatePipe } from '../../pipes/role-translate.pipe';
import { FormPreviewComponent } from '../admin/form-preview.component';
import { ProcessManagementComponent } from '../admin/process-management.component';
import { ReportsComponent } from '../reports/reports.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PhaseIndicatorComponent, SpanishDatePipe, RoleTranslatePipe, FormPreviewComponent, ProcessManagementComponent, ReportsComponent],
  template: `
    <div class="dashboard-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <img src="assets/logo.png" alt="FUMC Logo" class="sidebar-logo">
          <h2>Panel</h2>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Tablero
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/formats" routerLinkActive="active">
            <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Formatos
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/users" routerLinkActive="active">
            <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Usuarios
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/processes" routerLinkActive="active">
            <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Procesos
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/tokens" routerLinkActive="active">
            <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            Códigos de Registro
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/reports" routerLinkActive="active">
            <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Reportes
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="user-profile">
            <span class="user-name">{{ currentUser?.fullName || currentUser?.username }}</span>
            <span class="user-role">{{ currentUser?.role | roleTranslate }}</span>
          </div>
          <button (click)="logout()" class="btn-logout">Cerrar Sesión</button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        
        <!-- Dashboard View -->
        <div *ngIf="currentView === 'dashboard'" class="view-section">
          <div class="view-header">
            <h1>Mis Formularios de Desempeño</h1>
          </div>

          <div class="filters-section">
            <div class="filters-left">
              <button (click)="setFilter('progress')" [class.active]="currentFilter === 'progress'" class="filter-tab">En Progreso</button>
              <button (click)="setFilter('finished')" [class.active]="currentFilter === 'finished'" class="filter-tab">Terminado</button>
              <button *ngIf="isAdmin" (click)="setFilter('deleted')" [class.active]="currentFilter === 'deleted'" class="filter-tab">Eliminados</button>
            </div>
            <button *ngIf="!isAdmin" (click)="createNewForm()" class="btn btn-friendly">+ Nuevo Formulario</button>
          </div>

          <!-- Advanced Filters -->
          <div class="advanced-filters">
            <div class="filter-group">
              <label>Año:</label>
              <input type="number" [(ngModel)]="filterYear" placeholder="Ej: 2024" class="filter-input">
            </div>
            <div class="filter-group">
              <label>Área:</label>
              <input type="text" [(ngModel)]="filterArea" placeholder="Buscar por área" class="filter-input">
            </div>
            <div class="filter-group">
              <label>Proceso:</label>
              <input type="text" [(ngModel)]="filterProceso" placeholder="Buscar por proceso" class="filter-input">
            </div>
            <div class="filter-group" *ngIf="currentFilter === 'progress'">
              <label>Fase:</label>
              <select [(ngModel)]="filterPhase" class="filter-input">
                <option [ngValue]="null">Todas</option>
                <option [ngValue]="1">Fase 1</option>
                <option [ngValue]="2">Fase 2</option>
                <option [ngValue]="3">Fase 3</option>
                <option [ngValue]="4">Fase 4</option>
                <option [ngValue]="5">Fase 5</option>
              </select>
            </div>
            <button (click)="clearFilters()" class="btn-clear-filters">Limpiar Filtros</button>
          </div>

          <div class="grid">
            <div *ngFor="let form of filteredForms" class="card form-card" 
                 [class.deleted-form]="currentFilter === 'deleted'"
                 (click)="currentFilter !== 'deleted' && openForm(form.id)">
              <div class="form-header">
                <h3>Evaluación {{ form.year }}</h3>
                <div class="badges-container">
                  <span class="badge phase-{{ form.currentPhase }}">Fase {{ form.currentPhase }}</span>
                  <span *ngIf="currentFilter === 'deleted'" class="badge badge-deleted">Eliminado</span>
                </div>
              </div>
              <div *ngIf="isAdmin && form.user" class="user-badge">
                👤 {{ getFullName(form.user) }}
              </div>
              <div class="form-details">
                <div class="progress-bar-container">
                  <div class="progress-bar" [style.width.%]="getProgressPercentage(form.currentPhase)"></div>
                </div>
                <p><strong>Área:</strong> {{ form.area || 'No definido' }}</p>
                <p><strong>Proceso:</strong> {{ form.proceso || 'No definido' }}</p>
                <p *ngIf="currentFilter !== 'deleted'"><strong>Actualizado:</strong> {{ form.fechaInicio | spanishDate }}</p>
                <p *ngIf="currentFilter === 'deleted'"><strong>Eliminado:</strong> {{ form.deletedAt | date:'dd/MM/yyyy' }}</p>
              </div>
              
              <!-- Deleted forms actions -->
              <div *ngIf="currentFilter === 'deleted' && isAdmin" class="deleted-actions" (click)="$event.stopPropagation()">
                <button (click)="restoreForm(form.id)" class="btn-modern-restore">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v6h6"/><path d="M3 13a9 9 0 1 0 3-7.7L3 8"/></svg>
                  Restaurar
                </button>
                <button (click)="permanentlyDeleteForm(form.id)" class="btn-modern-delete">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  Borrar Definitivo
                </button>
              </div>
            </div>
          </div>
          <div *ngIf="filteredForms.length === 0" class="empty-state">
            <p>No se encontraron formularios.</p>
          </div>

          <!-- Pagination Controls -->
          <div *ngIf="totalPages > 1" class="pagination-container">
            <button (click)="previousPage()" [disabled]="currentPage === 0" class="btn-pagination">
              ← Anterior
            </button>
            <div class="page-numbers">
              <button *ngFor="let page of pageNumbers" 
                      (click)="goToPage(page)" 
                      [class.active]="page === currentPage"
                      class="btn-page-number">
                {{ page + 1 }}
              </button>
            </div>
            <button (click)="nextPage()" [disabled]="currentPage === totalPages - 1" class="btn-pagination">
              Siguiente →
            </button>
          </div>
          <div *ngIf="totalPages > 0" class="pagination-info">
            Mostrando página {{ currentPage + 1 }} de {{ totalPages }} | Total: {{ totalItems }} formularios
          </div>
        </div>

        <!-- Formats Admin View -->
        <div *ngIf="currentView === 'formats'" class="view-section">
          <h1>Administración de Formatos</h1>
          <div class="card admin-card">
            <h3>Eliminar Formato</h3>
            <p class="text-secondary">Ingrese el ID único del formato para eliminarlo permanentemente.</p>
            <div class="input-group">
              <input type="text" [(ngModel)]="deleteFormId" placeholder="Ej: 00005" class="form-control">
              <button (click)="deleteForm()" class="btn btn-danger">Eliminar</button>
            </div>
          </div>
        </div>

        <!-- Users Admin View -->
        <div *ngIf="currentView === 'users'" class="view-section">
          <h1>Administración de Usuarios</h1>
          
          <div class="user-admin-layout">
            <!-- User List -->
            <div class="card user-list-card">
              <div class="search-box">
                <input type="text" [(ngModel)]="userSearchTerm" (input)="filterUsers()" placeholder="Buscar por nombre, usuario o cédula..." class="form-control">
              </div>
              <div class="user-list">
                <div *ngFor="let user of filteredUsers" 
                     class="user-item" 
                     [class.selected]="selectedUser?.id === user.id"
                     (click)="selectUser(user)">
                  <div class="user-avatar">
                    {{ getInitials(user) }}
                  </div>
                  <div class="user-info-mini">
                    <span class="name">{{ user.firstName }} {{ user.firstLastName }}</span>
                    <span class="username">{{ '@' + user.username }}</span>
                  </div>
                  <span class="badge role-{{ user.role }}">{{ user.role | roleTranslate }}</span>
                </div>
              </div>
            </div>

            <!-- User Details -->
            <div class="card user-details-card" *ngIf="selectedUser">
              <div class="details-header">
                <h2>Detalles del Usuario</h2>
                <button (click)="clearSelection()" class="btn-close">×</button>
              </div>
              
              <div class="details-content">
                <div class="detail-row">
                  <label>Nombre Completo:</label>
                  <span>{{ selectedUser.firstName }} {{ selectedUser.secondName }} {{ selectedUser.firstLastName }} {{ selectedUser.secondLastName }}</span>
                </div>
                <div class="detail-row">
                  <label>Usuario:</label>
                  <span>{{ selectedUser.username }}</span>
                </div>
                <div class="detail-row">
                  <label>Cédula:</label>
                  <span>{{ selectedUser.cedula }}</span>
                </div>
                <div class="detail-row">
                  <label>Email:</label>
                  <span>{{ selectedUser.email }}</span>
                </div>
                <div class="detail-row">
                  <label>Rol Actual:</label>
                  <span class="badge role-{{ selectedUser.role }}">{{ selectedUser.role | roleTranslate }}</span>
                </div>
              </div>

              <div class="details-actions">
                <button *ngIf="selectedUser.role !== 'ADMIN'" (click)="promoteUser(selectedUser)" class="btn btn-primary full-width">
                  Promover a Admin
                </button>
                <button *ngIf="selectedUser.role === 'ADMIN'" (click)="revokeAdmin(selectedUser)" class="btn btn-warning full-width">
                  Revocar Admin
                </button>
                <button (click)="deleteUser(selectedUser)" class="btn btn-danger full-width">
                  Eliminar Usuario
                </button>
              </div>
            </div>

            <div class="card empty-details" *ngIf="!selectedUser">
              <p>Seleccione un usuario para ver los detalles y acciones disponibles.</p>
            </div>
          </div>
        </div>

        <!-- Reports View -->
        <div *ngIf="currentView === 'reports'" class="view-section">
          <app-reports></app-reports>
        </div>

        <!-- Processes View -->
        <div *ngIf="currentView === 'processes'" class="view-section">
          <app-process-management></app-process-management>
        </div>

        <!-- Tokens View -->
        <div *ngIf="currentView === 'tokens'" class="view-section">
          <h1>Códigos de Registro</h1>
          
          <div class="card token-generate-card">
            <div class="token-header">
              <div class="token-header-text">
                <div class="token-header-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
                <div>
                  <h3>Generar Nuevo Código</h3>
                  <p class="text-secondary">Crea códigos únicos para permitir el registro de nuevos usuarios</p>
                </div>
              </div>
              <button (click)="generateToken()" class="btn-generate">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Generar Código
              </button>
            </div>
          </div>

          <div class="card" style="margin-top: 1.5rem;">
            <div class="tokens-list-header">
              <h3>Códigos Generados</h3>
              <span class="tokens-count">{{ registrationTokens.length }} código{{ registrationTokens.length !== 1 ? 's' : '' }}</span>
            </div>
            <div class="tokens-list">
              <div *ngFor="let token of registrationTokens" class="token-card" [class.token-card-used]="token.used">
                <div class="token-card-left">
                  <div class="token-status-indicator" [class.status-available]="!token.used" [class.status-used]="token.used"></div>
                  <div class="token-card-content">
                    <div class="token-code-row">
                      <code class="token-code-display">{{ token.token }}</code>
                      <span *ngIf="!token.used" class="token-pill token-pill-available">Disponible</span>
                      <span *ngIf="token.used" class="token-pill token-pill-used">Usado</span>
                    </div>
                    <div class="token-meta-row">
                      <span class="token-meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {{ token.createdAt | date:'dd/MM/yyyy HH:mm' }}
                      </span>
                      <span *ngIf="token.used" class="token-meta-item token-meta-used">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {{ token.usedByUsername }} · {{ token.usedAt | date:'dd/MM/yyyy' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="token-card-actions">
                  <button *ngIf="!token.used" (click)="copyToken(token.token)" class="token-action-btn token-action-copy" title="Copiar código">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                  <button *ngIf="!token.used" (click)="deleteToken(token.id)" class="token-action-btn token-action-delete" title="Eliminar código">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
            </div>
            <div *ngIf="registrationTokens.length === 0" class="empty-state-tokens">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
              <p>No hay códigos de registro generados</p>
              <span class="text-secondary">Genera un código para permitir el registro de nuevos usuarios</span>
            </div>
          </div>
        </div>

      </main>

      <!-- Form Preview Modal -->
      <app-form-preview *ngIf="showPreviewModal" [formData]="previewFormData" (closeModal)="closePreviewModal()"></app-form-preview>

    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; min-height: 100vh; background: #ffffff; }
    
    /* Sidebar */
    .sidebar {
      width: 260px;
      background: white;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      z-index: 10;
      box-shadow: 2px 0 8px rgba(0,0,0,0.05);
    }
    .sidebar-header { padding: 1.5rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid var(--border-color); }
    .sidebar-logo { height: 50px; width: auto; } /* Larger Logo */
    .sidebar-header h2 { font-size: 1.5rem; margin: 0; color: var(--fumc-blue-dark); }
    .sidebar-nav { flex: 1; padding: 1rem 0; }
    .sidebar-nav a {
      display: block;
      padding: 0.75rem 1.5rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .sidebar-nav a:hover { background: var(--fumc-gray-light); color: var(--fumc-blue); }
    .sidebar-nav a.active { background: var(--fumc-blue-light); color: var(--fumc-blue-dark); border-right: 3px solid var(--fumc-blue); }
    .nav-icon { vertical-align: middle; margin-right: 0.5rem; flex-shrink: 0; }
    .sidebar-nav a { display: flex; align-items: center; }
    .sidebar-footer { padding: 1.5rem; border-top: 1px solid var(--border-color); }
    .user-profile { display: flex; flex-direction: column; margin-bottom: 1rem; }
    .user-name { font-weight: 600; color: var(--fumc-blue-dark); }
    .user-role { font-size: 0.8rem; color: var(--text-secondary); }
    .btn-logout { width: 100%; padding: 0.5rem; background: none; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; color: #dc2626; }
    .btn-logout:hover { background: #fee2e2; border-color: #dc2626; }

    /* Main Content */
    .main-content { flex: 1; margin-left: 260px; padding: 2rem; background: #f9fafb; }
    .view-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .view-section h1 { font-size: 1.75rem; color: var(--fumc-blue-dark); margin-bottom: 1.5rem; }
    
    /* Cards & Grid */
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .form-card { cursor: pointer; transition: all 0.3s; border-left: 4px solid var(--fumc-blue); position: relative; }
    .form-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.12); }
    .form-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .form-header h3 { margin: 0; font-size: 1.1rem; color: var(--fumc-blue-dark); }
    .badges-container { display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-end; }
    
    .form-actions { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }
    .btn-preview { width: 100%; padding: 0.5rem 1rem; background: var(--fumc-blue); color: white; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
    .btn-preview:hover { background: var(--fumc-blue-dark); }
    
    /* Admin Styles */
    .input-group { display: flex; gap: 1rem; max-width: 400px; margin-top: 1rem; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    
    /* Phase Badges */
    .phase-1 { background: #e0f2fe; color: #0369a1; }
    .phase-2 { background: #fce7f3; color: #be185d; }
    .phase-3 { background: #fef3c7; color: #b45309; }
    .phase-4 { background: #dcfce7; color: #15803d; }
    .phase-5 { background: #f3f4f6; color: #1f2937; border: 1px solid #d1d5db; }
    .badge-deleted { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }

    /* Status Badges */
    .status-progress { background: #dbeafe; color: #1e40af; }
    .status-finished { background: #dcfce7; color: #166534; }

    .role-ADMIN { background: #dbeafe; color: #1e40af; }
    .role-USER { background: #f3f4f6; color: #374151; }
    
    /* Deleted Forms */
    .deleted-form { opacity: 0.8; border-left-color: #dc2626; cursor: default; }
    .deleted-form:hover { transform: none; }
    .deleted-actions { display: flex; gap: 0.75rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed #e2e8f0; }

    .btn-modern-restore { display: flex; align-items: center; justify-content: center; gap: 0.4rem; flex: 1; padding: 0.6rem; border: none; border-radius: 8px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2); }
    .btn-modern-restore:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(16, 185, 129, 0.35); }
    
    .btn-modern-delete { display: flex; align-items: center; justify-content: center; gap: 0.4rem; flex: 1; padding: 0.6rem; border: none; border-radius: 8px; background: linear-gradient(135deg, #f43f5e 0%, #be123c 100%); color: white; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(244, 63, 94, 0.2); }
    .btn-modern-delete:hover { transform: translateY(-2px); box-shadow: 0 6px 14px rgba(244, 63, 94, 0.35); }

    .btn-sm { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
    
    /* User Admin Layout */
    .user-admin-layout { display: flex; gap: 2rem; height: calc(100vh - 200px); }
    .user-list-card { flex: 1; display: flex; flex-direction: column; padding: 0; overflow: hidden; }
    .search-box { padding: 1rem; border-bottom: 1px solid var(--border-color); }
    .search-box input { width: 100%; box-sizing: border-box; }
    .user-list { flex: 1; overflow-y: auto; }
    .user-item { padding: 1rem; display: flex; align-items: center; gap: 1rem; cursor: pointer; border-bottom: 1px solid var(--border-color); transition: background 0.2s; }
    .user-item:hover { background: var(--fumc-gray-light); }
    .user-item.selected { background: var(--fumc-blue-light); border-left: 4px solid var(--fumc-blue); }
    .user-avatar { width: 40px; height: 40px; background: var(--fumc-blue); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .user-info-mini { flex: 1; display: flex; flex-direction: column; }
    .user-info-mini .name { font-weight: 600; color: var(--fumc-blue-dark); }
    .user-info-mini .username { font-size: 0.8rem; color: var(--text-secondary); }
    
    .user-details-card { flex: 1; display: flex; flex-direction: column; }
    .details-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; }
    .details-header h2 { margin: 0; font-size: 1.25rem; }
    .btn-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary); }
    .details-content { flex: 1; }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid #f0f0f0; padding-bottom: 0.5rem; }
    .detail-row label { font-weight: 600; color: var(--text-secondary); }
    .details-actions { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
    .full-width { width: 100%; }
    .empty-details { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); text-align: center; }

    /* Reports */
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
    .report-card { text-align: center; }
    .report-card button { margin-top: 1rem; width: 100%; }
    
    /* Utils */
    .btn-primary { background: var(--fumc-blue); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; }
    .btn-warning { background: #d97706; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; }
    .btn-danger { background: #dc2626; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; }
    .btn-success { background: #16a34a; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; }
    .form-control { padding: 0.6rem; border: 1px solid var(--border-color); border-radius: 6px; width: 100%; }
    .filters-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; background: white; padding: 0.75rem 1.5rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .filters-left { display: flex; gap: 0.5rem; background: var(--fumc-gray-light); padding: 0.25rem; border-radius: 8px; }
    .filter-tab { background: none; border: none; padding: 0.5rem 1.25rem; cursor: pointer; border-radius: 6px; transition: all 0.2s; color: var(--text-secondary); font-weight: 500; }
    .filter-tab.active { background: var(--fumc-blue); color: white; box-shadow: 0 2px 4px rgba(0, 86, 179, 0.2); }
    .filter-tab:hover:not(.active) { background: rgba(0, 86, 179, 0.1); }
    .btn-friendly { background: #10b981; color: white; border: none; padding: 0.6rem 1.5rem; border-radius: 20px; cursor: pointer; font-weight: 500; transition: all 0.2s; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2); }
    .btn-friendly:hover { background: #059669; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3); }
    
    /* Progress Bar */
    .progress-bar-container { width: 100%; height: 6px; background: #e5e7eb; border-radius: 3px; margin-bottom: 0.75rem; overflow: hidden; }
    .progress-bar { height: 100%; background: linear-gradient(90deg, var(--fumc-blue) 0%, #0ea5e9 100%); border-radius: 3px; transition: width 0.3s ease; }
    
    /* Token Management - Redesigned */
    .token-generate-card { border: 1px solid var(--border-color); }
    .token-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
    .token-header-text { display: flex; align-items: center; gap: 1rem; }
    .token-header-icon { width: 44px; height: 44px; background: linear-gradient(135deg, var(--fumc-blue), #0ea5e9); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
    .token-header h3 { margin: 0 0 0.25rem 0; }
    .btn-generate { display: flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, var(--fumc-blue), #0ea5e9); color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.25s; box-shadow: 0 2px 8px rgba(0, 86, 179, 0.25); white-space: nowrap; }
    .btn-generate:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0, 86, 179, 0.35); }
    .btn-generate:active { transform: translateY(0); }
    
    .tokens-list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .tokens-list-header h3 { margin: 0; }
    .tokens-count { font-size: 0.8rem; color: var(--text-secondary); background: #f1f5f9; padding: 0.25rem 0.75rem; border-radius: 999px; font-weight: 500; }
    .tokens-list { display: flex; flex-direction: column; gap: 0.75rem; }
    
    .token-card { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; border: 1px solid #e2e8f0; border-radius: 10px; background: #fafbfc; transition: all 0.2s ease; }
    .token-card:hover { border-color: #cbd5e1; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .token-card-used { opacity: 0.65; background: #f8f9fa; }
    .token-card-left { display: flex; align-items: center; gap: 1rem; flex: 1; min-width: 0; }
    .token-status-indicator { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .status-available { background: #22c55e; box-shadow: 0 0 6px rgba(34, 197, 94, 0.4); }
    .status-used { background: #94a3b8; }
    .token-card-content { flex: 1; min-width: 0; }
    .token-code-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem; flex-wrap: wrap; }
    .token-code-display { font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace; font-size: 0.85rem; color: #1e293b; background: #e2e8f0; padding: 0.3rem 0.75rem; border-radius: 6px; font-weight: 500; letter-spacing: 0.3px; word-break: break-all; }
    .token-card-used .token-code-display { color: #94a3b8; text-decoration: line-through; background: #f1f5f9; }
    .token-pill { font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
    .token-pill-available { background: #dcfce7; color: #15803d; }
    .token-pill-used { background: #f1f5f9; color: #64748b; }
    .token-meta-row { display: flex; gap: 1.25rem; flex-wrap: wrap; }
    .token-meta-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.78rem; color: #64748b; }
    .token-meta-used { color: #94a3b8; }
    
    .token-card-actions { display: flex; gap: 0.5rem; flex-shrink: 0; margin-left: 1rem; }
    .token-action-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; color: #64748b; }
    .token-action-copy:hover { background: #eff6ff; border-color: #93c5fd; color: #2563eb; }
    .token-action-delete:hover { background: #fef2f2; border-color: #fca5a5; color: #dc2626; }
    .token-action-btn:active { transform: scale(0.92); }
    
    .empty-state-tokens { text-align: center; padding: 3rem 1rem; }
    .empty-state-tokens svg { margin-bottom: 1rem; }
    .empty-state-tokens p { font-size: 1rem; color: #475569; font-weight: 500; margin: 0 0 0.25rem 0; }
    .empty-state-tokens span { font-size: 0.85rem; }
    .text-secondary { color: var(--text-secondary); }
    
    /* Advanced Filters */
    .advanced-filters { display: flex; gap: 1rem; align-items: flex-end; padding: 1rem; background: #f9fafb; border-radius: 8px; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filter-group { display: flex; flex-direction: column; gap: 0.25rem; }
    .filter-group label { font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); }
    .filter-input { padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 6px; font-size: 0.9rem; min-width: 150px; }
    .filter-input:focus { outline: none; border-color: var(--fumc-blue); box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.1); }
    .btn-clear-filters { padding: 0.5rem 1rem; background: #f3f4f6; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
    .btn-clear-filters:hover { background: #e5e7eb; }
    
    /* Pagination */
    .pagination-container { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; padding: 1rem; }
    .btn-pagination { padding: 0.5rem 1rem; background: var(--fumc-blue); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-pagination:hover:not(:disabled) { background: var(--fumc-blue-dark); transform: translateY(-1px); }
    .btn-pagination:disabled { background: #d1d5db; cursor: not-allowed; opacity: 0.5; }
    .page-numbers { display: flex; gap: 0.5rem; }
    .btn-page-number { padding: 0.5rem 0.75rem; background: white; color: var(--fumc-blue); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.2s; min-width: 40px; }
    .btn-page-number:hover { background: var(--fumc-blue-light); border-color: var(--fumc-blue); }
    .btn-page-number.active { background: var(--fumc-blue); color: white; border-color: var(--fumc-blue); }
    .pagination-info { text-align: center; color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem; padding-bottom: 1rem; }
  `]
})
export class DashboardComponent implements OnInit {
  forms: any[] = [];
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  userSearchTerm: string = '';

  currentUser: any;
  isLeader: boolean = false;
  isAdmin: boolean = false;
  currentFilter: 'progress' | 'finished' | 'deleted' = 'progress';
  deleteFormId: string = '';
  registrationTokens: any[] = [];



  // Getter to determine current view from URL
  get currentView(): 'dashboard' | 'formats' | 'users' | 'reports' | 'processes' | 'tokens' {
    const url = this.router.url;
    if (url.includes('/admin/formats')) return 'formats';
    if (url.includes('/admin/users')) return 'users';
    if (url.includes('/admin/processes')) return 'processes';
    if (url.includes('/admin/tokens')) return 'tokens';
    if (url.includes('/admin/reports')) return 'reports';
    return 'dashboard';
  }

  // Filter properties
  filterYear: number | null = null;
  filterArea: string = '';
  filterProceso: string = '';
  filterPhase: number | null = null;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 8;
  totalPages: number = 0;
  totalItems: number = 0;

  constructor(
    private formService: FormService,
    private authService: AuthService,
    private notify: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isLeader = this.currentUser?.role === 'LIDER';
    this.isAdmin = this.currentUser?.role === 'ADMIN' || this.currentUser?.role === 'LIDER';
    this.loadForms();
    if (this.isAdmin) {
      this.loadUsers();
      this.loadTokens();
    }
  }

  loadForms(page: number = 0) {
    if (this.currentUser) {
      this.formService.getForms(this.currentUser.userId, page, this.pageSize, this.currentFilter).subscribe(response => {
        this.forms = response.forms;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.loadForms(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.loadForms(this.currentPage - 1);
    }
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.loadForms(page);
    }
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  loadUsers() {
    this.authService.getUsers().subscribe(data => {
      this.users = data;
      this.filterUsers();
    });
  }

  filterUsers() {
    if (!this.userSearchTerm) {
      this.filteredUsers = this.users;
    } else {
      const term = this.userSearchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(u =>
        (u.firstName + ' ' + u.firstLastName).toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        u.cedula.includes(term)
      );
    }
  }

  selectUser(user: any) {
    this.selectedUser = user;
  }

  clearSelection() {
    this.selectedUser = null;
  }

  getInitials(user: any): string {
    if (!user) return '';
    const first = user.firstName?.charAt(0) || '';
    const last = user.firstLastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  promoteUser(user: any) {
    this.showConfirm(
      '¿Promover a Administrador?',
      `El usuario ${user.username} tendrá permisos completos de administrador.`,
      'warning',
      'Promover',
      () => {
        this.authService.updateUserRole(user.id, 'ADMIN').subscribe(() => {
          this.showToast('success', 'Usuario promovido', `${user.username} ahora es Administrador`);
          this.loadUsers();
          this.selectedUser = null;
        });
      }
    );
  }

  revokeAdmin(user: any) {
    this.showConfirm(
      '¿Revocar permisos de Admin?',
      `El usuario ${user.username} perderá todos los permisos de administrador.`,
      'warning',
      'Revocar',
      () => {
        this.authService.updateUserRole(user.id, 'USER').subscribe(() => {
          this.showToast('success', 'Permisos revocados', `${user.username} ahora es usuario regular`);
          this.loadUsers();
          this.selectedUser = null;
        });
      }
    );
  }

  deleteUser(user: any) {
    this.showConfirm(
      '¿Eliminar usuario?',
      `Se eliminará a ${user.username} y todos sus datos. Esta acción no se puede deshacer.`,
      'danger',
      'Eliminar',
      () => {
        this.authService.deleteUser(user.id).subscribe({
          next: () => {
            this.showToast('success', 'Usuario eliminado', `${user.username} fue eliminado exitosamente`);
            this.loadUsers();
            this.selectedUser = null;
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            this.showToast('error', 'Error', 'No fue posible eliminar el usuario');
          }
        });
      }
    );
  }

  get filteredForms() {
    let filtered = this.forms;

    // For deleted filter, forms are already filtered by backend
    if (this.currentFilter === 'deleted') {
      // Apply only search filters, not phase filters
      if (this.filterYear) {
        filtered = filtered.filter(f => f.year === this.filterYear);
      }
      if (this.filterArea && this.filterArea.trim()) {
        filtered = filtered.filter(f =>
          f.area && f.area.toLowerCase().includes(this.filterArea.toLowerCase())
        );
      }
      if (this.filterProceso && this.filterProceso.trim()) {
        filtered = filtered.filter(f =>
          f.proceso && f.proceso.toLowerCase().includes(this.filterProceso.toLowerCase())
        );
      }
      return filtered;
    }

    // For progress and finished, backend already filters by phase
    // Just apply additional search filters

    // Apply year filter
    if (this.filterYear) {
      filtered = filtered.filter(f => f.year === this.filterYear);
    }

    // Apply area filter
    if (this.filterArea && this.filterArea.trim()) {
      filtered = filtered.filter(f =>
        f.area && f.area.toLowerCase().includes(this.filterArea.toLowerCase())
      );
    }

    // Apply proceso filter
    if (this.filterProceso && this.filterProceso.trim()) {
      filtered = filtered.filter(f =>
        f.proceso && f.proceso.toLowerCase().includes(this.filterProceso.toLowerCase())
      );
    }

    // Apply phase filter (only for progress view, for additional filtering)
    if (this.filterPhase && this.currentFilter === 'progress') {
      filtered = filtered.filter(f => f.currentPhase === this.filterPhase);
    }

    return filtered;
  }

  clearFilters() {
    this.filterYear = null;
    this.filterArea = '';
    this.filterProceso = '';
    this.filterPhase = null;
  }

  setFilter(filter: 'progress' | 'finished' | 'deleted') {
    this.currentFilter = filter;
    this.currentPage = 0; // Reset to first page when changing filter
    if (filter === 'deleted') {
      this.loadDeletedForms();
    } else {
      this.loadForms();
    }
  }

  loadDeletedForms(page: number = 0) {
    if (this.isAdmin) {
      this.formService.getDeletedForms(page, this.pageSize).subscribe(response => {
        this.forms = response.forms;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.totalItems = response.totalItems;
      });
    }
  }

  restoreForm(formId: number) {
    this.showConfirm(
      '¿Restaurar formulario?',
      'El formulario volverá a estar disponible en la lista principal.',
      'warning',
      'Restaurar',
      () => {
        this.formService.restoreForm(formId).subscribe({
          next: () => {
            this.showToast('success', 'Formulario restaurado', 'El formulario está disponible nuevamente');
            this.loadDeletedForms(this.currentPage);
          },
          error: (err) => {
            console.error('Error restoring form:', err);
            this.showToast('error', 'Error', 'No fue posible restaurar el formulario');
          }
        });
      }
    );
  }

  permanentlyDeleteForm(formId: number) {
    this.showConfirm(
      '¿Eliminar permanentemente?',
      'El formulario se eliminará de forma definitiva. Esta acción NO se puede deshacer.',
      'danger',
      'Eliminar permanentemente',
      () => {
        this.formService.permanentlyDeleteForm(formId).subscribe({
          next: () => {
            this.showToast('success', 'Formulario eliminado', 'El formulario fue eliminado permanentemente');
            this.loadDeletedForms(this.currentPage);
          },
          error: (err) => {
            console.error('Error permanently deleting form:', err);
            this.showToast('error', 'Error', 'No fue posible eliminar el formulario');
          }
        });
      }
    );
  }

  createNewForm() {
    const newForm = {
      user: { id: this.currentUser.userId },
      year: new Date().getFullYear(),
      currentPhase: 1
    };
    this.formService.createForm(newForm).subscribe(form => {
      this.router.navigate(['/form', form.id]);
    });
  }

  openForm(id: number) {
    this.router.navigate(['/form', id]);
  }

  viewConsolidated() {
    this.router.navigate(['/admin/reports']);
  }

  logout() {
    this.authService.logout();
  }

  deleteForm() {
    if (!this.deleteFormId) return;

    const id = parseInt(this.deleteFormId, 10);

    if (isNaN(id)) {
      this.showToast('warning', 'ID inválido', 'Por favor ingrese un ID numérico válido');
      return;
    }

    this.showConfirm(
      '¿Eliminar formato?',
      `El formato #${this.deleteFormId} será eliminado. Esta acción no se puede deshacer.`,
      'danger',
      'Eliminar',
      () => {
        this.formService.deleteForm(id).subscribe({
          next: () => {
            this.showToast('success', 'Formato eliminado', `El formato #${this.deleteFormId} fue eliminado exitosamente`);
            this.deleteFormId = '';
            this.loadForms();
          },
          error: (err) => {
            console.error('Error deleting form:', err);
            this.showToast('error', 'Error', 'No se pudo eliminar el formato. Verifique que el ID sea correcto.');
          }
        });
      }
    );
  }

  // Form Preview Modal
  showPreviewModal: boolean = false;
  previewFormData: any = null;

  previewForm(form: any): void {
    this.previewFormData = form;
    this.showPreviewModal = true;
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.previewFormData = null;
  }

  getProgressPercentage(phase: number): number {
    return (phase / 5) * 100;
  }

  // Token Management
  loadTokens() {
    this.authService.getRegistrationTokens().subscribe({
      next: (data) => this.registrationTokens = data,
      error: (err) => console.error('Error loading tokens:', err)
    });
  }

  generateToken() {
    this.authService.generateRegistrationToken().subscribe({
      next: (token) => {
        this.showToast('success', 'Código generado', 'El nuevo código de registro está listo para compartir');
        this.loadTokens();
      },
      error: (err) => {
        console.error('Error generating token:', err);
        this.showToast('error', 'Error', 'No fue posible generar el código de registro');
      }
    });
  }

  copyToken(token: string) {
    navigator.clipboard.writeText(token).then(() => {
      this.showToast('info', 'Código copiado', 'El código fue copiado al portapapeles');
    }).catch(err => {
      console.error('Error copying token:', err);
      this.showToast('error', 'Error', 'No se pudo copiar el código');
    });
  }

  deleteToken(tokenId: number) {
    this.showConfirm(
      '¿Eliminar código de registro?',
      'Este código ya no podrá ser utilizado para registrar nuevos usuarios.',
      'danger',
      'Eliminar',
      () => {
        this.authService.deleteRegistrationToken(tokenId).subscribe({
          next: () => {
            this.showToast('success', 'Código eliminado', 'El código de registro fue eliminado exitosamente');
            this.loadTokens();
          },
          error: (err) => {
            console.error('Error deleting token:', err);
            this.showToast('error', 'Error', 'No fue posible eliminar el código');
          }
        });
      }
    );
  }

  // Delegate to NotificationService
  showToast(type: any, title: string, message?: string) {
    this.notify.showToast(type, title, message);
  }

  showConfirm(title: string, message: string, type: any, confirmText: string, onConfirm: () => void) {
    this.notify.showConfirm(title, message, type, confirmText, onConfirm);
  }

  getFullName(user: any): string {
    const parts = [
      user.firstName,
      user.secondName,
      user.firstLastName,
      user.secondLastName
    ].filter(part => part && part.trim() !== '');
    return parts.join(' ');
  }
}
