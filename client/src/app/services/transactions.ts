
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: number;
  amount: number;
  type: string;
  category: string;
  transactionDate: string;
  note: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateTransactionRequest {
  amount: number;
  type: string;
  category: string;
  transactionDate: string;
  note: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5194/api/Transactions';

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  createTransaction(
    transaction: CreateTransactionRequest
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      this.apiUrl,
      transaction
    );
  }

  updateTransaction(
    id: number,
    transaction: CreateTransactionRequest
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/${id}`,
      transaction
    );
  }

  deleteTransaction(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/${id}`
    );
  }
}
