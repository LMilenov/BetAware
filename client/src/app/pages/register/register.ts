import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected displayName = '';
  protected email = '';
  protected password = '';
  protected confirmPassword = '';

  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal('');

  protected onSubmit(): void {
    this.error.set('');
    this.success.set('');

    if (!this.displayName.trim() || !this.email.trim() || !this.password) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('Password must contain at least 6 characters.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);

    this.auth.register({
      displayName: this.displayName.trim(),
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Account created successfully! You can now sign in.');
        setTimeout(() => {
          void this.router.navigateByUrl('/login');
        }, 1200);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err.error?.message ??
          err.error?.title ??
          'Unable to create your account. Please try again.'
        );
      }
    });
  }
}
