import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
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
    path: 'transactions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/transactions/transactions').then(m => m.Transactions)
  },
  {
    path: 'alternatives',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/alternatives/alternatives')
        .then(m => m.Alternatives)
  },
  {
    path: 'investments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/investments/investments')
        .then(m => m.Investments)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
