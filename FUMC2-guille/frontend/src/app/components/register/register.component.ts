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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
      
      // Clean all form values by removing any whitespace
      const cleanedValues = { ...this.registerForm.value };
      Object.keys(cleanedValues).forEach(key => {
        if (typeof cleanedValues[key] === 'string') {
          // Remove ALL whitespace from strings
          cleanedValues[key] = cleanedValues[key].replace(/\s/g, '');
        }
      });

      this.authService.register(cleanedValues).subscribe({
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
