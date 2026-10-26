
import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Dashboard as DashboardService,
  DashboardData
} from '../../services/dashboard';

@Component({
  selector: 'app-investments',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './investments.html',
  styleUrl: './investments.css'
})
export class Investments implements OnInit {
  private readonly dashboardService = inject(DashboardService);

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
        console.error('Failed to load investment data:', err);
        this.error.set(
          err.status === 401
            ? 'Please log in to view your investment potential.'
            : 'Unable to load investment data. Please try again.'
        );
        this.loading.set(false);
      }
    });
  }
}
