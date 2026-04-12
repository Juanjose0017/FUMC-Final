import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Toast {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  entering: boolean;
  exiting: boolean;
}

export interface ConfirmDialog {
  visible: boolean;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info';
  confirmText?: string;
  onConfirm?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private confirmSubject = new BehaviorSubject<ConfirmDialog>({
    visible: false, title: '', message: '', type: 'danger'
  });
  confirm$ = this.confirmSubject.asObservable();

  showToast(type: Toast['type'], title: string, message?: string) {
    const toast: Toast = { type, title, message, entering: true, exiting: false };
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, toast]);

    setTimeout(() => { toast.entering = false; }, 350);
    setTimeout(() => { this.dismissToast(toast); }, 4000);
  }

  dismissToast(toast: Toast) {
    const current = this.toastsSubject.value;
    const index = current.indexOf(toast);
    if (index >= 0) {
      toast.exiting = true;
      setTimeout(() => {
        const updated = this.toastsSubject.value.filter(t => t !== toast);
        this.toastsSubject.next(updated);
      }, 300);
    }
  }

  removeToast(index: number) {
    const current = this.toastsSubject.value;
    if (index >= 0 && index < current.length) {
      this.dismissToast(current[index]);
    }
  }

  showConfirm(title: string, message: string, type: ConfirmDialog['type'], confirmText: string, onConfirm: () => void) {
    this.confirmSubject.next({ visible: true, title, message, type, confirmText, onConfirm });
  }

  acceptConfirm() {
    const current = this.confirmSubject.value;
    if (current.onConfirm) {
      current.onConfirm();
    }
    this.confirmSubject.next({ ...current, visible: false });
  }

  cancelConfirm() {
    const current = this.confirmSubject.value;
    this.confirmSubject.next({ ...current, visible: false });
  }
}
