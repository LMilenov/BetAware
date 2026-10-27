
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
  MonthlyStatistics,
  CategoryStatistics
} from '../../services/dashboard';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { forkJoin } from 'rxjs';

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

  protected readonly selectedPeriod = signal<3 | 6 | 12>(12);

  protected changePeriod(event: Event): void {
    const value = Number(
      (event.target as HTMLSelectElement).value
    );

    if (value !== 3 && value !== 6 && value !== 12) {
      return;
    }

    this.selectedPeriod.set(value);
    this.loadDashboardForSelectedPeriod();
  }

  protected readonly categoryStatistics = signal<CategoryStatistics[]>([]);
  protected readonly categoriesLoading = signal(true);
  protected readonly categoriesError = signal('');

  protected readonly categoryBreakdown = computed(() => {
    const records = this.categoryStatistics().filter(
      item => item.totalLost > 0
    );

    const totalLosses = records.reduce(
      (sum, item) => sum + item.totalLost,
      0
    );

    const categoryInfo: Record<
      string,
      { label: string; emoji: string; color: string }
    > = {
      SportsBetting: {
        label: 'Sports Betting',
        emoji: '⚽',
        color: '#4ade80'
      },
      Slots: {
        label: 'Slots',
        emoji: '🎰',
        color: '#a3e635'
      },
      Casino: {
        label: 'Casino',
        emoji: '🎲',
        color: '#a78bfa'
      },
      Poker: {
        label: 'Poker',
        emoji: '🃏',
        color: '#60a5fa'
      },
      Other: {
        label: 'Other',
        emoji: '🎯',
        color: '#fbbf24'
      }
    };

    let offset = 0;

    return records.map(item => {
      const info = categoryInfo[item.category] ?? {
        label: item.category,
        emoji: '🎯',
        color: '#94a3b8'
      };

      const percent = totalLosses > 0
        ? (item.totalLost / totalLosses) * 100
        : 0;

      const startPercent = offset;
      offset += percent;

      return {
        ...item,
        ...info,
        percent,
        startPercent,
        endPercent: offset
      };
    });
  });

  protected readonly categoryLossTotal = computed(() =>
    this.categoryBreakdown().reduce(
      (sum, category) => sum + category.totalLost,
      0
    )
  );

  protected readonly categoryChartBackground = computed(() => {
    const categories = this.categoryBreakdown();

    if (categories.length === 0) {
      return 'conic-gradient(#29332e 0% 100%)';
    }

    const segments = categories.map(category =>
      `${category.color} ${category.startPercent}% ${category.endPercent}%`
    );

    return `conic-gradient(from -90deg, ${segments.join(', ')})`;
  });

  protected readonly monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];


  protected readonly chartMonths = computed(() => {
    const statistics = this.monthlyStatistics();
    const period = this.selectedPeriod();
    const now = new Date();

    const selectedMonths = Array.from(
      { length: period },
      (_, index) => {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() - (period - 1 - index),
          1
        );

        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const item = statistics.find(
          stat => stat.year === year && stat.month === month
        );

        return {
          year,
          month,
          label: `${this.monthLabels[month - 1]} '${String(year).slice(-2)}`,
          totalWon: item?.totalWon ?? 0,
          totalLost: item?.totalLost ?? 0,
          netResult: item?.netResult ?? 0
        };
      }
    );

    const maxAbsValue = Math.max(
      1,
      ...selectedMonths.map(item => Math.abs(item.netResult))
    );

    const left = 78;
    const right = 750;
    const centerY = 120;
    const maxOffset = 85;
    const step = period > 1
      ? (right - left) / (period - 1)
      : 0;

    return selectedMonths.map((item, index) => ({
      ...item,
      x: left + index * step,
      y: centerY - (item.netResult / maxAbsValue) * maxOffset
    }));
  });

  protected readonly chartAxisTicks = computed(() => {
    const maxAbsValue = Math.max(
      1,
      ...this.chartMonths().map(
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
    this.loadDashboardForSelectedPeriod();
    this.loadMonthlyStatistics();
  }

  private loadDashboardForSelectedPeriod(): void {
    const now = new Date();

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - this.selectedPeriod() + 1,
      1
    );

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    };

    const startDateString = formatDate(startDate);
    const endDateString = formatDate(now);

    this.loading.set(true);
    this.error.set('');


    this.loadCategoryStatistics(
      startDateString,
      endDateString
    );
    this.dashboardService.getDashboard(
      1,
      startDateString,
      endDateString
    ).subscribe({
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

  private loadMonthlyStatistics(): void {
    const currentYear = new Date().getFullYear();

    this.monthlyLoading.set(true);
    this.monthlyError.set('');

    forkJoin({
      previous: this.dashboardService.getMonthlyStatistics(
        currentYear - 1
      ),
      current: this.dashboardService.getMonthlyStatistics(
        currentYear
      )
    }).subscribe({
      next: ({ previous, current }) => {
        this.monthlyStatistics.set([
          ...previous,
          ...current
        ]);
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


  private loadCategoryStatistics(
    startDate: string,
    endDate: string
  ): void {
    this.categoriesLoading.set(true);
    this.categoriesError.set('');

    this.dashboardService
      .getCategoryStatistics(startDate, endDate)
      .subscribe({
        next: (data) => {
          this.categoryStatistics.set(data);
          this.categoriesLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load category statistics:', err);
          this.categoriesError.set(
            'Unable to load category statistics. Please try again.'
          );
          this.categoriesLoading.set(false);
        }
      });
  }

}
