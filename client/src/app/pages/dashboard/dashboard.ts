
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

    const maxAbsValue = Math.max(
      1,
      ...statistics.map(item => Math.abs(item.netResult))
    );

    const width = 720;
    const left = 78;
    const right = 750;
    const centerY = 120;
    const maxOffset = 85;

    return this.monthLabels.map((label, index) => {
      const month = index + 1;
      const item = statistics.find(stat => stat.month === month);
      const netResult = item?.netResult ?? 0;

      const x = left + index * ((right - left) / 11);
      const y = centerY - (netResult / maxAbsValue) * maxOffset;

      return {
        month,
        label,
        totalWon: item?.totalWon ?? 0,
        totalLost: item?.totalLost ?? 0,
        netResult,
        x,
        y
      };
    });
  });

  protected readonly chartAxisTicks = computed(() => {
    const maxAbsValue = Math.max(
      1,
      ...this.monthlyStatistics().map(
        item => Math.abs(item.netResult)
      )
    );

    return [1, 0.5, 0, -0.5, -1].map(factor => ({
      value: maxAbsValue * factor,
      y: 120 - factor * 85
    }));
  });

  protected readonly chartLinePoints = computed(() =>
    this.chartMonths()
      .map(month => `${month.x},${month.y}`)
      .join(' ')
  );


  protected readonly chartSegments = computed(() => {
    const months = this.chartMonths();
    const centerY = 120;

    const segments: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      type: 'positive' | 'negative';
    }[] = [];

    for (let i = 0; i < months.length - 1; i++) {
      const from = months[i];
      const to = months[i + 1];

      const crossesZero =
        (from.netResult > 0 && to.netResult < 0) ||
        (from.netResult < 0 && to.netResult > 0);

      if (crossesZero) {
        const ratio =
          from.netResult / (from.netResult - to.netResult);

        const crossingX =
          from.x + (to.x - from.x) * ratio;

        segments.push({
          x1: from.x,
          y1: from.y,
          x2: crossingX,
          y2: centerY,
          type: from.netResult > 0 ? 'positive' : 'negative'
        });

        segments.push({
          x1: crossingX,
          y1: centerY,
          x2: to.x,
          y2: to.y,
          type: to.netResult > 0 ? 'positive' : 'negative'
        });
      } else {
        segments.push({
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
          type: (from.netResult + to.netResult) / 2 >= 0
            ? 'positive'
            : 'negative'
        });
      }
    }

    return segments;
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
