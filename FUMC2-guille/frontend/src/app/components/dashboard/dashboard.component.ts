import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../services/auth.service';
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
            📊 Tablero
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/formats" routerLinkActive="active">
            🗑️ Formatos
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/users" routerLinkActive="active">
            👥 Usuarios
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/processes" routerLinkActive="active">
            ⚙️ Procesos
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/tokens" routerLinkActive="active">
            🔑 Códigos de Registro
          </a>
          <a *ngIf="isAdmin" routerLink="/admin/reports" routerLinkActive="active">
            📈 Reportes
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
                <button (click)="restoreForm(form.id)" class="btn btn-success btn-sm">
                  ↺ Restaurar
                </button>
                <button (click)="permanentlyDeleteForm(form.id)" class="btn btn-danger btn-sm">
                  🗑️ Eliminar Permanente
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
          
          <div class="card">
            <div class="token-header">
              <div>
                <h3>Generar Nuevo Código</h3>
                <p class="text-secondary">Crea códigos únicos para permitir el registro de nuevos usuarios</p>
              </div>
              <button (click)="generateToken()" class="btn btn-primary">+ Generar Código</button>
            </div>
          </div>

          <div class="card" style="margin-top: 2rem;">
            <h3>Códigos Generados</h3>
            <div class="tokens-list">
              <div *ngFor="let token of registrationTokens" class="token-item">
                <div class="token-info">
                  <div class="token-value" [class.token-used]="token.used">
                    <span class="token-code">{{ token.token }}</span>
                    <button (click)="copyToken(token.token)" class="btn-copy" title="Copiar">📋</button>
                  </div>
                  <div class="token-meta">
                    <span>Creado: {{ token.createdAt | date:'short' }}</span>
                    <span *ngIf="token.used" class="used-badge">✓ Usado por {{ token.usedByUsername }} el {{ token.usedAt | date:'short' }}</span>
                    <span *ngIf="!token.used" class="available-badge">✓ Disponible</span>
                  </div>
                </div>
                <button (click)="deleteToken(token.id)" class="btn-icon-danger" title="Eliminar">
                  🗑️
                </button>
              </div>
            </div>
            <div *ngIf="registrationTokens.length === 0" class="empty-state">
              <p>No hay códigos de registro generados</p>
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
    .deleted-actions { display: flex; gap: 0.5rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); }
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
    
    /* Token Management */
    .token-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .tokens-list { margin-top: 1.5rem; }
    .token-item { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 1rem; background: white; transition: all 0.2s; }
    .token-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .token-info { flex: 1; }
    .token-value { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
    .token-code { font-family: 'Courier New', monospace; background: var(--fumc-gray-light); padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.9rem; color: var(--fumc-blue-dark); font-weight: 600; }
    .token-used .token-code { background: #f3f4f6; color: #9ca3af; text-decoration: line-through; }
    .btn-copy { background: none; border: 1px solid var(--border-color); padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 1rem; transition: all 0.2s; }
    .btn-copy:hover { background: var(--fumc-blue-light); border-color: var(--fumc-blue); }
    .token-meta { display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--text-secondary); }
    .used-badge { color: #dc2626; font-weight: 500; }
    .available-badge { color: #16a34a; font-weight: 500; }
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
    if (confirm(`¿Estás seguro de promover a ${user.username} a Administrador?`)) {
      this.authService.updateUserRole(user.id, 'ADMIN').subscribe(() => {
        alert('Usuario promovido exitosamente');
        this.loadUsers();
        this.selectedUser = null;
      });
    }
  }

  revokeAdmin(user: any) {
    if (confirm(`¿Estás seguro de revocar los permisos de administrador a ${user.username}?`)) {
      this.authService.updateUserRole(user.id, 'USER').subscribe(() => {
        alert('Permisos revocados exitosamente');
        this.loadUsers();
        this.selectedUser = null;
      });
    }
  }

  deleteUser(user: any) {
    if (confirm(`¿Estás seguro de eliminar al usuario ${user.username}? Esta acción eliminará todos sus datos y no se puede deshacer.`)) {
      this.authService.deleteUser(user.id).subscribe({
        next: () => {
          alert('Usuario eliminado exitosamente');
          this.loadUsers();
          this.selectedUser = null;
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Error al eliminar usuario');
        }
      });
    }
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
    if (confirm('¿Está seguro de restaurar este formulario?')) {
      this.formService.restoreForm(formId).subscribe({
        next: () => {
          alert('Formulario restaurado exitosamente');
          this.loadDeletedForms(this.currentPage);
        },
        error: (err) => {
          console.error('Error restoring form:', err);
          alert('Error al restaurar el formulario');
        }
      });
    }
  }

  permanentlyDeleteForm(formId: number) {
    if (confirm('¿Está seguro de eliminar PERMANENTEMENTE este formulario? Esta acción no se puede deshacer.')) {
      this.formService.permanentlyDeleteForm(formId).subscribe({
        next: () => {
          alert('Formulario eliminado permanentemente');
          this.loadDeletedForms(this.currentPage);
        },
        error: (err) => {
          console.error('Error permanently deleting form:', err);
          alert('Error al eliminar permanentemente el formulario');
        }
      });
    }
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
      alert('Por favor ingrese un ID válido');
      return;
    }

    if (confirm(`¿Está seguro de eliminar el formato #${this.deleteFormId}? Esta acción no se puede deshacer.`)) {
      this.formService.deleteForm(id).subscribe({
        next: () => {
          alert('Formato eliminado exitosamente');
          this.deleteFormId = '';
          this.loadForms();
        },
        error: (err) => {
          console.error('Error deleting form:', err);
          alert('Error al eliminar el formato. Verifique que el ID sea correcto.');
        }
      });
    }
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
        alert(`Código generado exitosamente:\n\n${token.token}\n\nCopie este código y compártalo con el nuevo usuario.`);
        this.loadTokens();
      },
      error: (err) => {
        console.error('Error generating token:', err);
        alert('Error al generar el código de registro');
      }
    });
  }

  copyToken(token: string) {
    navigator.clipboard.writeText(token).then(() => {
      alert('Código copiado al portapapeles');
    }).catch(err => {
      console.error('Error copying token:', err);
      alert('Error al copiar el código');
    });
  }

  deleteToken(tokenId: number) {
    if (confirm('¿Está seguro de eliminar este código de registro?')) {
      this.authService.deleteRegistrationToken(tokenId).subscribe({
        next: () => {
          alert('Código eliminado exitosamente');
          this.loadTokens();
        },
        error: (err) => {
          console.error('Error deleting token:', err);
          alert('Error al eliminar el código');
        }
      });
    }
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
