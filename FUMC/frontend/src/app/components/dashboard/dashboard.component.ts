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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  forms: any[] = [];
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  userSearchTerm: string = '';
  userTab: 'all' | 'admin' | 'user' = 'all';

  currentUser: any;
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
    this.isAdmin = this.currentUser?.role === 'ADMIN';
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

  setUserTab(tab: 'all' | 'admin' | 'user') {
    this.userTab = tab;
    this.clearSelection();
  }

  get displayedUsers() {
    if (this.userTab === 'admin') {
      return this.filteredUsers.filter(u => u.role === 'ADMIN');
    }
    if (this.userTab === 'user') {
      return this.filteredUsers.filter(u => u.role !== 'ADMIN');
    }
    return this.filteredUsers;
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
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(token).then(() => {
        this.showToast('info', 'Código copiado', 'El código fue copiado al portapapeles');
      }).catch(err => {
        console.error('Error copying token:', err);
        this.showToast('error', 'Error', 'No se pudo copiar el código');
      });
    } else {
      // Fallback para HTTP o navegadores antiguos
      try {
        const textArea = document.createElement("textarea");
        textArea.value = token;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        const successful = document.execCommand('copy');
        textArea.remove();
        if (successful) {
          this.showToast('info', 'Código copiado', 'El código fue copiado al portapapeles');
        } else {
          this.showToast('error', 'Error', 'No se pudo copiar el código');
        }
      } catch (err) {
        console.error('Fallback error copying token:', err);
        this.showToast('error', 'Error', 'No se pudo copiar el código');
      }
    }
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

  // Admin Password Management Modal
  showPasswordModal: boolean = false;
  selectedUserForPassword: any = null;
  adminNewPassword: string = '';
  adminConfirmPassword: string = '';
  showAdminPasswordText: boolean = false;
  isChangingPassword: boolean = false;

  openPasswordModal(user: any) {
    this.selectedUserForPassword = user;
    this.adminNewPassword = '';
    this.adminConfirmPassword = '';
    this.showAdminPasswordText = false;
    this.isChangingPassword = false;
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.selectedUserForPassword = null;
    this.adminNewPassword = '';
    this.adminConfirmPassword = '';
    this.isChangingPassword = false;
  }

  generateRandomPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pass = 'FUMC-';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.adminNewPassword = pass;
    this.adminConfirmPassword = pass;
    this.showAdminPasswordText = true;
    this.showToast('info', 'Contraseña generada', 'Se ha generado una contraseña segura automáticamente');
  }

  submitChangePasswordByAdmin() {
    if (!this.selectedUserForPassword) return;

    if (!this.adminNewPassword || this.adminNewPassword.trim().length < 6) {
      this.showToast('warning', 'Contraseña inválida', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.adminNewPassword !== this.adminConfirmPassword) {
      this.showToast('warning', 'No coinciden', 'Las contraseñas ingresadas no coinciden');
      return;
    }

    this.isChangingPassword = true;
    this.authService.changeUserPasswordByAdmin(this.selectedUserForPassword.id, this.adminNewPassword.trim()).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.showToast('success', 'Contraseña actualizada', `Contraseña cambiada exitosamente para ${this.selectedUserForPassword.username}`);
        this.closePasswordModal();
      },
      error: (err) => {
        this.isChangingPassword = false;
        console.error('Error changing user password:', err);
        const errorMsg = err.error?.message || 'No fue posible cambiar la contraseña';
        this.showToast('error', 'Error', errorMsg);
      }
    });
  }

  // Admin Edit User Modal
  showEditUserModal: boolean = false;
  editUserForm: any = {
    id: null,
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    cedula: '',
    email: '',
    username: '',
    role: 'USER'
  };
  isSavingUser: boolean = false;

  openEditUserModal(user: any) {
    this.editUserForm = {
      id: user.id,
      firstName: user.firstName || '',
      secondName: user.secondName || '',
      firstLastName: user.firstLastName || '',
      secondLastName: user.secondLastName || '',
      cedula: user.cedula || '',
      email: user.email || '',
      username: user.username || '',
      role: user.role || 'USER'
    };
    this.isSavingUser = false;
    this.showEditUserModal = true;
  }

  closeEditUserModal() {
    this.showEditUserModal = false;
    this.isSavingUser = false;
  }

  submitEditUser() {
    if (!this.editUserForm.firstName?.trim() || !this.editUserForm.firstLastName?.trim() || !this.editUserForm.secondLastName?.trim()) {
      this.showToast('warning', 'Campos requeridos', 'Por favor complete nombres y apellidos');
      return;
    }

    if (!this.editUserForm.cedula?.trim() || !this.editUserForm.email?.trim() || !this.editUserForm.username?.trim()) {
      this.showToast('warning', 'Campos requeridos', 'Cédula, correo y usuario son obligatorios');
      return;
    }

    this.isSavingUser = true;
    this.authService.updateUser(this.editUserForm.id, this.editUserForm).subscribe({
      next: (updatedUser) => {
        this.isSavingUser = false;
        this.showToast('success', 'Usuario actualizado', `Datos actualizados para ${updatedUser.username}`);

        // Update selected user in view
        if (this.selectedUser && this.selectedUser.id === updatedUser.id) {
          this.selectedUser = updatedUser;
        }

        // If current user is editing themselves
        if (this.currentUser && this.currentUser.userId === updatedUser.id) {
          this.currentUser.username = updatedUser.username;
          this.currentUser.role = updatedUser.role;
          this.currentUser.fullName = this.getFullName(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }

        this.loadUsers();
        this.closeEditUserModal();
      },
      error: (err) => {
        this.isSavingUser = false;
        console.error('Error updating user:', err);
        const errorMsg = err.error?.message || 'No fue posible actualizar el usuario';
        this.showToast('error', 'Error', errorMsg);
      }
    });
  }

  // Self Password Change Modal (Any Logged In User)
  showMyPasswordModal: boolean = false;
  myCurrentPassword: string = '';
  myNewPassword: string = '';
  myConfirmPassword: string = '';
  showMyPasswordText: boolean = false;
  isSavingMyPassword: boolean = false;

  openMyPasswordModal() {
    this.myCurrentPassword = '';
    this.myNewPassword = '';
    this.myConfirmPassword = '';
    this.showMyPasswordText = false;
    this.isSavingMyPassword = false;
    this.showMyPasswordModal = true;
  }

  closeMyPasswordModal() {
    this.showMyPasswordModal = false;
    this.myCurrentPassword = '';
    this.myNewPassword = '';
    this.myConfirmPassword = '';
    this.isSavingMyPassword = false;
  }

  submitMyPassword() {
    if (!this.myCurrentPassword) {
      this.showToast('warning', 'Contraseña actual requerida', 'Por favor ingresa tu contraseña actual');
      return;
    }

    if (!this.myNewPassword || this.myNewPassword.trim().length < 6) {
      this.showToast('warning', 'Nueva contraseña inválida', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.myNewPassword !== this.myConfirmPassword) {
      this.showToast('warning', 'No coinciden', 'Las contraseñas no coinciden');
      return;
    }

    this.isSavingMyPassword = true;
    this.authService.changeMyPassword(this.myCurrentPassword, this.myNewPassword.trim()).subscribe({
      next: () => {
        this.isSavingMyPassword = false;
        this.showToast('success', 'Contraseña cambiada', 'Tu contraseña ha sido actualizada exitosamente');
        this.closeMyPasswordModal();
      },
      error: (err) => {
        this.isSavingMyPassword = false;
        console.error('Error updating my password:', err);
        const errorMsg = err.error?.message || 'No fue posible cambiar la contraseña. Verifica tu contraseña actual.';
        this.showToast('error', 'Error', errorMsg);
      }
    });
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
