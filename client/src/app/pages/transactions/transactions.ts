
import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast';
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly transactions = signal<Transaction[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');


  protected readonly showForm = signal(false);
  protected readonly showDeleteConfirm = signal(false);
  protected readonly transactionToDelete = signal<Transaction | null>(null);
  protected readonly deleting = signal(false);
  protected readonly editingId = signal<number | null>(null);
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

    if (this.route.snapshot.queryParamMap.get('add') === 'true') {
      this.openForm();

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { add: null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
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
    this.editingId.set(null);

    this.amount = null;
    this.type = 'Win';
    this.category = 'SportsBetting';
    this.transactionDate = new Date().toISOString().slice(0, 10);
    this.note = '';

    this.showForm.set(true);
  }

  protected editTransaction(transaction: Transaction): void {
    this.formError.set('');
    this.editingId.set(transaction.id);

    this.amount = transaction.amount;
    this.type = transaction.type;
    this.category = transaction.category;
    this.transactionDate = transaction.transactionDate.slice(0, 10);
    this.note = transaction.note ?? '';

    this.showForm.set(true);
  }

  protected deleteTransaction(transaction: Transaction): void {
    this.transactionToDelete.set(transaction);
    this.showDeleteConfirm.set(true);
  }

  protected cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.transactionToDelete.set(null);
  }

  protected confirmDelete(): void {
    const transaction = this.transactionToDelete();

    if (!transaction || this.deleting()) {
      return;
    }

    this.deleting.set(true);

    this.transactionsService.deleteTransaction(transaction.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.cancelDelete();
        this.loadTransactions();

        this.toastService.success(
          'The transaction was successfully deleted.',
          'Transaction deleted'
        );
      },
      error: (err) => {
        console.error('Failed to delete transaction:', err);
        this.deleting.set(false);
        this.cancelDelete();

        this.toastService.error(
          'Unable to delete the transaction. Please try again.',
          'Delete failed'
        );
      }
    });
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

    const editingId = this.editingId();

    const operation = editingId !== null
      ? this.transactionsService.updateTransaction(editingId, request)
      : this.transactionsService.createTransaction(request);


    operation.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.editingId.set(null);

        this.amount = null;
        this.type = 'Win';
        this.category = 'SportsBetting';
        this.transactionDate = new Date().toISOString().slice(0, 10);
        this.note = '';

        this.loadTransactions();

        this.toastService.success(
          editingId !== null
            ? 'The transaction was successfully updated.'
            : 'The transaction was successfully created.',
          editingId !== null
            ? 'Transaction updated'
            : 'Transaction created'
        );
      },
      error: (err) => {
        console.error('Failed to save transaction:', err);
        this.saving.set(false);

        this.toastService.error(
          err.error?.message ??
          'Unable to save the transaction. Please try again.',
          'Save failed'
        );
      }
    });

  }

}
