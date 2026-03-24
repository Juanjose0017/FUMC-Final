import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="card login-card">
        <div class="logo-section">
          <div class="logo-wrapper">
            <img src="assets/logo.png" alt="FUMC Logo" class="app-logo">
          </div>
          <h2>Recuperar Contraseña</h2>
          <p class="subtitle" *ngIf="step === 1">Ingrese su correo o celular para recibir un código</p>
          <p class="subtitle" *ngIf="step === 2">Ingrese el código recibido y su nueva contraseña</p>
        </div>
        
        <!-- Step 1: Request Code -->
        <form *ngIf="step === 1" [formGroup]="requestForm" (ngSubmit)="onRequestCode()">
          <div class="form-group">
            <label class="form-label">Usuario</label>
            <input type="text" formControlName="username" class="form-control" placeholder="Ingrese su usuario de ingreso">
            <div *ngIf="requestForm.get('username')?.touched && requestForm.get('username')?.invalid" class="text-danger">
              Ingrese su usuario
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary w-100" [disabled]="requestForm.invalid || loading">
            {{ loading ? 'Enviando...' : 'Enviar Código' }}
          </button>
        </form>

        <!-- Step 2: Reset Password -->
        <form *ngIf="step === 2" [formGroup]="resetForm" (ngSubmit)="onResetPassword()">
          <div class="form-group">
            <label class="form-label">Código de Verificación</label>
            <input type="text" formControlName="code" class="form-control" placeholder="Ingrese el código">
          </div>

          <div class="form-group">
            <label class="form-label">Nueva Contraseña</label>
            <input type="password" formControlName="newPassword" class="form-control" placeholder="Nueva contraseña">
          </div>

          <div class="form-group">
            <label class="form-label">Confirmar Contraseña</label>
            <input type="password" formControlName="confirmPassword" class="form-control" placeholder="Confirmar contraseña">
            <div *ngIf="resetForm.hasError('mismatch') && resetForm.get('confirmPassword')?.touched" class="text-danger">
              Las contraseñas no coinciden
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary w-100" [disabled]="resetForm.invalid || loading">
            {{ loading ? 'Actualizando...' : 'Cambiar Contraseña' }}
          </button>
        </form>

        <div class="register-link">
          <a routerLink="/login">Volver al inicio de sesión</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #003d7a 0%, #0056b3 50%, #c41e3a 100%);
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      padding: 2rem;
      border-radius: 12px;
    }
    .logo-section {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 3px solid #003d7a;
    }
    .logo-wrapper {
      background: white;
      border-radius: 50%;
      width: 150px;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      padding: 1rem;
    }
    .app-logo {
      max-height: 100px;
      max-width: 100px;
      mix-blend-mode: multiply;
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
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
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
      width: 100%;
      font-size: 1rem;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 61, 122, 0.6);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
    }
    .register-link a {
      color: #c41e3a;
      text-decoration: none;
      font-weight: 600;
    }
    .register-link a:hover {
      text-decoration: underline;
    }
    .text-danger {
      color: #dc2626;
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }
  `]
})
export class ForgotPasswordComponent {
  step = 1;
  loading = false;
  requestForm: FormGroup;
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      username: ['', Validators.required]
    });

    this.resetForm = this.fb.group({
      code: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onRequestCode() {
    if (this.requestForm.valid) {
      this.loading = true;
      const username = this.requestForm.get('username')?.value;

      this.authService.requestPasswordReset(username).subscribe({
        next: (res) => {
          this.loading = false;
          this.step = 2;
          alert('Si el usuario existe, se ha enviado un código a su correo o celular registrado.');
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          // Show the specific error message from backend if available
          const errorMessage = err.error || 'Error al procesar la solicitud. Verifique el usuario.';
          alert(errorMessage);
        }
      });
    }
  }

  onResetPassword() {
    if (this.resetForm.valid) {
      this.loading = true;
      const { code, newPassword } = this.resetForm.value;

      this.authService.resetPassword(code, newPassword).subscribe({
        next: (res) => {
          this.loading = false;
          alert('Contraseña actualizada exitosamente');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          alert('Error al actualizar contraseña. Código inválido o expirado.');
        }
      });
    }
  }
}
