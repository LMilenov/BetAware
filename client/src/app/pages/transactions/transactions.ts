
import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  TransactionsService,
  Transaction,
  CreateTransactionRequest
} from '../../services/transactions';

@Component({
  selector: 'app-transactions',
  imports: [DatePipe, DecimalPipe, RouterLink, FormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions implements OnInit {
  private readonly transactionsService = inject(TransactionsService);

  protected readonly transactions = signal<Transaction[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');


  protected readonly showForm = signal(false);
  protected readonly saving = signal(false);
  protected readonly formError = signal('');

  protected amount: number | null = null;
  protected type = 'Win';
  protected category = 'SportsBetting';
  protected transactionDate = new Date().toISOString().slice(0, 10);
  protected note = '';

  protected readonly categories = [
    { value: 'SportsBetting', label: 'Sports Betting' },
    { value: 'Casino', label: 'Casino' },
    { value: 'Slots', label: 'Slots' },
    { value: 'Poker', label: 'Poker' },
    { value: 'Other', label: 'Other' }
  ];


  ngOnInit(): void {
    this.loadTransactions();
  }

  protected loadTransactions(): void {
    this.loading.set(true);
    this.error.set('');

    this.transactionsService.getTransactions().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load transactions:', err);
        this.error.set(
          err.status === 401
            ? 'Please log in to view your transactions.'
            : 'Unable to load transactions. Please try again.'
        );
        this.loading.set(false);
      }
    });
  }


  protected openForm(): void {
    this.formError.set('');
    this.showForm.set(true);
  }

  protected cancelForm(): void {
    this.showForm.set(false);
    this.formError.set('');
  }

  protected saveTransaction(): void {
    this.formError.set('');

    if (this.amount === null || !Number.isFinite(this.amount) || this.amount <= 0) {
      this.formError.set('Please enter an amount greater than zero.');
      return;
    }

    if (!this.transactionDate) {
      this.formError.set('Please select a transaction date.');
      return;
    }

    const request: CreateTransactionRequest = {
      amount: this.amount,
      type: this.type,
      category: this.category,
      transactionDate: new Date(`${this.transactionDate}T12:00:00Z`).toISOString(),
      note: this.note.trim() || null
    };

    this.saving.set(true);

    this.transactionsService.createTransaction(request).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.amount = null;
        this.type = 'Win';
        this.category = 'SportsBetting';
        this.transactionDate = new Date().toISOString().slice(0, 10);
        this.note = '';
        this.loadTransactions();
      },
      error: (err) => {
        console.error('Failed to create transaction:', err);
        this.saving.set(false);
        this.formError.set(
          err.error?.message ??
          'Unable to save transaction. Please try again.'
        );
      }
    });
  }
}
