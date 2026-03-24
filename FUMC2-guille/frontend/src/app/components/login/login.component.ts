import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="card login-card">
        <div class="logo-section">
          <div class="logo-wrapper">
            <img src="assets/logo.png" alt="FUMC Logo" class="app-logo">
          </div>
          <h2>Bienvenido</h2>
          <p class="subtitle">Sistema de Gestión de Rendimiento</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Usuario</label>
            <input type="text" formControlName="username" class="form-control" placeholder="Ingresa tu usuario">
          </div>
          
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input type="password" formControlName="password" class="form-control" placeholder="Ingresa tu contraseña">
          </div>

          <button type="submit" class="btn btn-primary w-100" [disabled]="loginForm.invalid">
            Iniciar Sesión
          </button>

          <div class="register-link" style="margin-top: 1rem; margin-bottom: 0.5rem;">
            <a routerLink="/forgot-password" style="color: #003d7a; font-size: 0.9rem;">¿Olvidaste tu contraseña?</a>
          </div>

          <div class="register-link">
            ¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a>
          </div>
        </form>
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
      width: 200px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      padding: 1rem;
    }
    .app-logo {
      max-height: 140px;
      max-width: 140px;
      mix-blend-mode: multiply;
      margin-bottom: 0;
    }
    h2 {
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #003d7a 0%, #c41e3a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
      font-size: 2rem;
      margin-top: 0;
    }
    .subtitle {
      color: #003d7a;
      font-weight: 600;
      font-size: 1rem;
      margin: 0;
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
      color: #6b7280;
    }
    .register-link a {
      color: #c41e3a;
      text-decoration: none;
      font-weight: 600;
    }
    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          alert('Error de inicio de sesión');
        }
      });
    }
  }
}
