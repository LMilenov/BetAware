
import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Dashboard as DashboardService, DashboardData } from '../../services/dashboard';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  private readonly user = this.getUserFromToken();

  protected readonly userEmail = signal(this.user.email);
  protected readonly userFullName = signal(this.user.fullName);

  protected logout(): void {
    this.auth.logout();

    this.toastService.info(
      'You have successfully signed out of your account.',
      'Logged out'
    );

    void this.router.navigateByUrl('/login');
  }

  private getUserFromToken(): { email: string; fullName: string } {
    const token = this.auth.getToken();

    if (!token) {
      return { email: '', fullName: '' };
    }

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      return {
        email:
          decoded.email ??
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
          '',
        fullName: decoded.fullName ?? ''
      };
    } catch {
      return { email: '', fullName: '' };
    }
  }

  protected readonly dashboard = signal<DashboardData | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.dashboardService.getDashboard(1).subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load dashboard:', err);
        this.error.set(
          err.status === 401
            ? 'Please log in to view your financial overview.'
            : 'Unable to load dashboard data. Please try again.'
        );
        this.loading.set(false);
      }
    });
  }
}
