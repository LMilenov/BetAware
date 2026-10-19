
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  totalTransactions: number;
  totalWon: number;
  totalLost: number;
  netResult: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  biggestWin: number;
  biggestLoss: number;
  investmentPotential: InvestmentPotential[];
}

export interface InvestmentPotential {
  investmentScenarioId: number;
  investmentName: string;
  totalLosses: number;
  investableAmount: number;
  possibleUnits: number;
  investedAmount: number;
  uninvestedAmount: number;
  estimatedProfit: number;
  estimatedValue: number;
  years: number;
  annualReturnRate: number;
  currency: string;
}

export interface MonthlyStatistics {
  year: number;
  month: number;
  totalWon: number;
  totalLost: number;
  netResult: number;
}

export interface CategoryStatistics {
  category: string;
  totalTransactions: number;
  totalWon: number;
  totalLost: number;
  netResult: number;
}

@Injectable({
  providedIn: 'root'
})
export class Dashboard {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5194/api/Dashboard';

  getDashboard(years = 1): Observable<DashboardData> {
    const params = new HttpParams().set('years', years);

    return this.http.get<DashboardData>(this.apiUrl, { params });
  }

  getMonthlyStatistics(year: number): Observable<MonthlyStatistics[]> {
    const params = new HttpParams().set('year', year);

    return this.http.get<MonthlyStatistics[]>(
      `${this.apiUrl}/monthly`,
      { params }
    );
  }

  getCategoryStatistics(): Observable<CategoryStatistics[]> {
    return this.http.get<CategoryStatistics[]>(
      `${this.apiUrl}/categories`
    );
  }
}
