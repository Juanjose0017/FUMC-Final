import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  step = 1;
  loading = false;
  requestForm: FormGroup;
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notify: NotificationService
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
          this.notify.showToast('info', 'Código Enviado', 'Si el usuario existe, se ha enviado un código a su correo o celular registrado.');
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          // Show the specific error message from backend if available
          const errorMessage = err.error || 'Error al procesar la solicitud. Verifique el usuario.';
          this.notify.showToast('error', 'Error', errorMessage);
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
          this.notify.showToast('success', 'Éxito', 'Contraseña actualizada exitosamente');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
          this.notify.showToast('error', 'Error', 'Error al actualizar contraseña. Código inválido o expirado.');
        }
      });
    }
  }
}
