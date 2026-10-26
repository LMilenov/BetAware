
import { DecimalPipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  Dashboard as DashboardService,
  DashboardData,
  MonthlyStatistics
} from '../../services/dashboard';
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

  protected openAddTransaction(): void {
    void this.router.navigate(['/transactions'], {
      queryParams: { add: 'true' }
    });
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

  protected readonly monthlyStatistics = signal<MonthlyStatistics[]>([]);
  protected readonly monthlyLoading = signal(true);
  protected readonly monthlyError = signal('');

  protected readonly monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  protected readonly chartMonths = computed(() => {
    const statistics = this.monthlyStatistics();

    const maxValue = Math.max(
      1,
      ...statistics.flatMap(item => [item.totalWon, item.totalLost])
    );

    return this.monthLabels.map((label, index) => {
      const month = index + 1;
      const item = statistics.find(stat => stat.month === month);

      const totalWon = item?.totalWon ?? 0;
      const totalLost = item?.totalLost ?? 0;

      return {
        month,
        label,
        totalWon,
        totalLost,
        netResult: item?.netResult ?? 0,
        wonHeight: (totalWon / maxValue) * 100,
        lostHeight: (totalLost / maxValue) * 100
      };
    });
  });

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
    this.loadMonthlyStatistics(new Date().getFullYear());
  }

  private loadMonthlyStatistics(year: number): void {
    this.monthlyLoading.set(true);
    this.monthlyError.set('');

    this.dashboardService.getMonthlyStatistics(year).subscribe({
      next: (data) => {
        this.monthlyStatistics.set(data);
        this.monthlyLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load monthly statistics:', err);
        this.monthlyError.set(
          'Unable to load monthly statistics. Please try again.'
        );
        this.monthlyLoading.set(false);
      }
    });
  }
}
