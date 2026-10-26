import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected displayName = '';
  protected email = '';
  protected password = '';
  protected confirmPassword = '';

  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected onSubmit(): void {
    this.error.set('');

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

        this.toastService.success(
          'Your account has been created. You can now sign in.',
          'Account created'
        );

        setTimeout(() => {
          void this.router.navigateByUrl('/login');
        }, 1200);
      },

      error: (err) => {
        this.loading.set(false);

        if (Array.isArray(err.error)) {
          const identityErrors = err.error as {
            code?: string;
            description?: string;
          }[];

          const messages = identityErrors.map(({ code, description }) => {
            switch (code) {
              case 'DuplicateUserName':
              case 'DuplicateEmail':
                return 'An account with this email already exists.';

              case 'PasswordTooShort':
                return description ?? 'Password is too short.';

              case 'PasswordRequiresDigit':
                return 'Password must contain at least one number.';

              case 'PasswordRequiresLower':
                return 'Password must contain at least one lowercase letter.';

              case 'PasswordRequiresUpper':
                return 'Password must contain at least one uppercase letter.';

              case 'PasswordRequiresNonAlphanumeric':
                return 'Password must contain at least one special character.';

              default:
                return description ?? 'Unable to create your account. Please try again.';
            }
          });

          this.error.set([...new Set(messages)].join(' '));
          return;
        }

        this.error.set(
          err.error?.message ??
          err.error?.title ??
          'Unable to create your account. Please try again.'
        );
      }

    });
  }
}
