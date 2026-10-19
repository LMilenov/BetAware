
import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard, DashboardData } from './services/dashboard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('BetAware');

  private readonly dashboardService = inject(Dashboard);

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
