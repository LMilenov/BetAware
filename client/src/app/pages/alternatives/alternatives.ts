
import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Dashboard as DashboardService,
  DashboardData
} from '../../services/dashboard';

interface Alternative {
  id: number;
  icon: string;
  title: string;
  description: string;
  price: number;
  unit: string;
}

@Component({
  selector: 'app-alternatives',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './alternatives.html',
  styleUrl: './alternatives.css'
})
export class Alternatives implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  protected readonly dashboard = signal<DashboardData | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly alternatives: Alternative[] = [
    {
      id: 1,
      icon: '🏋️',
      title: 'Gym membership',
      description: 'Invest in your fitness and wellbeing.',
      price: 35,
      unit: 'month'
    },
    {
      id: 2,
      icon: '📚',
      title: 'Books and learning',
      description: 'Build new skills and knowledge.',
      price: 20,
      unit: 'book'
    },
    {
      id: 3,
      icon: '🍽️',
      title: 'Dinner with friends',
      description: 'Create memories with people you care about.',
      price: 50,
      unit: 'dinner'
    },
    {
      id: 4,
      icon: '🎧',
      title: 'Quality headphones',
      description: 'Upgrade your everyday listening experience.',
      price: 120,
      unit: 'pair'
    },
    {
      id: 5,
      icon: '🧳',
      title: 'Weekend getaway',
      description: 'Spend time exploring somewhere new.',
      price: 250,
      unit: 'trip'
    },
    {
      id: 6,
      icon: '💻',
      title: 'Technology fund',
      description: 'Put money aside for your next computer.',
      price: 800,
      unit: 'fund'
    }
  ];

  ngOnInit(): void {
    this.dashboardService.getDashboard(1).subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load alternatives:', err);
        this.error.set(
          err.status === 401
            ? 'Please log in to view your alternatives.'
            : 'Unable to load your financial data. Please try again.'
        );
        this.loading.set(false);
      }
    });
  }

  protected getEquivalentCount(price: number): number {
    const totalLost = this.dashboard()?.totalLost ?? 0;
    return Math.floor(totalLost / price);
  }
}