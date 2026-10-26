import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast-container',
  imports: [],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css'
})
export class ToastContainer {
  protected readonly toastService = inject(ToastService);
  protected readonly toast = this.toastService.toast;

  protected dismiss(): void {
    this.toastService.dismiss();
  }
}
