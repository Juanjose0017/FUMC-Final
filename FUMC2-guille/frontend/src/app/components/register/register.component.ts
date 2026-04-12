import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <!-- Success Modal -->
      <div *ngIf="showSuccessModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="success-icon">✓</div>
          <h2>¡Registro Exitoso!</h2>
          <p class="success-message">Tu cuenta ha sido creada correctamente</p>
          
          <div class="username-display">
            <label>Tu usuario es:</label>
            <div class="username-value">{{ generatedUsername }}</div>
            <p class="username-hint">Usa este usuario para iniciar sesión</p>
          </div>

          <button (click)="goToLogin()" class="btn btn-primary w-100">
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>

      <div class="card register-card">
        <div class="logo-section">
          <img src="assets/logo.png" alt="FUMC Logo" class="app-logo">
          <h2>Crear Cuenta</h2>
          <p class="subtitle">Fundación Universitaria María Cano</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Primer Nombre *</label>
              <input type="text" formControlName="firstName" class="form-control" placeholder="Primer nombre">
              <div *ngIf="registerForm.get('firstName')?.touched && registerForm.get('firstName')?.invalid" class="error-text">
                Requerido
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Segundo Nombre</label>
              <input type="text" formControlName="secondName" class="form-control" placeholder="Segundo nombre (opcional)">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Primer Apellido *</label>
              <input type="text" formControlName="firstLastName" class="form-control" placeholder="Primer apellido">
              <div *ngIf="registerForm.get('firstLastName')?.touched && registerForm.get('firstLastName')?.invalid" class="error-text">
                Requerido
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Segundo Apellido *</label>
              <input type="text" formControlName="secondLastName" class="form-control" placeholder="Segundo apellido">
              <div *ngIf="registerForm.get('secondLastName')?.touched && registerForm.get('secondLastName')?.invalid" class="error-text">
                Requerido
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Cédula *</label>
            <input type="text" formControlName="cedula" class="form-control" placeholder="Número de cédula">
            <div *ngIf="registerForm.get('cedula')?.touched && registerForm.get('cedula')?.invalid" class="error-text">
              La cédula es requerida (mínimo 4 dígitos)
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Email *</label>
            <input type="email" formControlName="email" class="form-control" placeholder="correo@ejemplo.com">
            <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid" class="error-text">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">El email es requerido</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Email inválido</span>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Código de Registro *</label>
            <input type="text" formControlName="registrationToken" class="form-control" placeholder="Código proporcionado por el administrador">
            <div *ngIf="registerForm.get('registrationToken')?.touched && registerForm.get('registrationToken')?.invalid" class="error-text">
              El código de registro es requerido
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Contraseña *</label>
            <input type="password" formControlName="password" class="form-control" placeholder="Elige una contraseña">
            <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid" class="error-text">
              La contraseña es requerida
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100" [disabled]="registerForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Registrando...' : 'Registrarse' }}
          </button>
          
          <div class="login-link">
            ¿Ya tienes cuenta? <a routerLink="/login">Inicia Sesión</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #003d7a 0%, #0056b3 50%, #c41e3a 100%);
      padding: 2rem;
    }
    .register-card {
      width: 100%;
      max-width: 600px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      padding: 2rem;
    }
    .logo-section {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 3px solid #003d7a;
    }
    .app-logo {
      max-height: 120px;
      margin-bottom: 1rem;
    }
    h2 {
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #003d7a 0%, #c41e3a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
      font-size: 1.5rem;
    }
    .subtitle {
      color: #003d7a;
      font-weight: 600;
      font-size: 1rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #003d7a;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: #003d7a;
      box-shadow: 0 0 0 3px rgba(0, 61, 122, 0.1);
    }
    .btn-primary {
      background: linear-gradient(135deg, #003d7a 0%, #0056b3 100%);
      color: white;
      border: none;
      padding: 0.875rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 61, 122, 0.4);
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 61, 122, 0.6);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .w-100 {
      width: 100%;
    }
    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: #6b7280;
    }
    .login-link a {
      color: #c41e3a;
      text-decoration: none;
      font-weight: 600;
    }
    .login-link a:hover {
      text-decoration: underline;
    }
    .error-text {
      color: #c41e3a;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }
    .modal-content {
      background: white;
      padding: 3rem;
      border-radius: 16px;
      max-width: 500px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    }
    .success-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      font-size: 3rem;
      color: white;
      font-weight: bold;
    }
    .success-message {
      color: #6b7280;
      margin-bottom: 2rem;
    }
    .username-display {
      background: linear-gradient(135deg, #003d7a 0%, #0056b3 100%);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    .username-display label {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
      display: block;
      margin-bottom: 0.5rem;
    }
    .username-value {
      background: rgba(255, 255, 255, 0.95);
      color: #003d7a;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
      word-break: break-all;
    }
    .username-hint {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.85rem;
      margin: 0;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting: boolean = false;
  showSuccessModal: boolean = false;
  generatedUsername: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notify: NotificationService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      secondName: [''],
      firstLastName: ['', Validators.required],
      secondLastName: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      registrationToken: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          this.generatedUsername = response.username;
          this.showSuccessModal = true;
        },
        error: (err) => {
          this.isSubmitting = false;
          this.notify.showToast('error', 'Error en el registro', err.error || 'Intente nuevamente');
        }
      });
    }
  }

  closeModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }
}
