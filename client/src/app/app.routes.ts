
import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { AppLayout } from './layout/app-layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(m => m.Register)
  },
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./pages/transactions/transactions').then(m => m.Transactions)
      },
      {
        path: 'alternatives',
        loadComponent: () =>
          import('./pages/alternatives/alternatives').then(m => m.Alternatives)
      },
      {
        path: 'investments',
        loadComponent: () =>
          import('./pages/investments/investments').then(m => m.Investments)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
