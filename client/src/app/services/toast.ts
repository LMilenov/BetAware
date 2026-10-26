
import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  type: ToastType;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly currentToast = signal<ToastMessage | null>(null);

  readonly toast = this.currentToast.asReadonly();

  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  success(message: string, title = 'Success'): void {
    this.show('success', title, message);
  }

  error(message: string, title = 'Something went wrong'): void {
    this.show('error', title, message);
  }

  info(message: string, title = 'Information'): void {
    this.show('info', title, message);
  }

  dismiss(): void {
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }

    this.currentToast.set(null);
  }

  private show(
    type: ToastType,
    title: string,
    message: string
  ): void {
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
    }

    this.currentToast.set({ type, title, message });

    this.timeoutId = setTimeout(() => {
      this.currentToast.set(null);
      this.timeoutId = undefined;
    }, 3500);
  }
}
