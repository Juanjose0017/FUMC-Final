import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Toast, ConfirmDialog } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Toast Notifications -->
    <div class="toast-container">
      <div *ngFor="let toast of toasts; let i = index" 
           class="toast" 
           [class.toast-success]="toast.type === 'success'" 
           [class.toast-error]="toast.type === 'error'" 
           [class.toast-info]="toast.type === 'info'"
           [class.toast-warning]="toast.type === 'warning'"
           [class.toast-enter]="toast.entering"
           [class.toast-exit]="toast.exiting">
        <div class="toast-icon">
          <svg *ngIf="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <svg *ngIf="toast.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <svg *ngIf="toast.type === 'info'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <svg *ngIf="toast.type === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="toast-content">
          <span class="toast-title">{{ toast.title }}</span>
          <span *ngIf="toast.message" class="toast-message">{{ toast.message }}</span>
        </div>
        <button class="toast-close" (click)="removeToast(i)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div *ngIf="confirmDialog.visible" class="confirm-overlay" (click)="cancelConfirm()">
      <div class="confirm-modal" (click)="$event.stopPropagation()">
        <div class="confirm-icon" [ngClass]="confirmDialog.type">
          <svg *ngIf="confirmDialog.type === 'danger'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <svg *ngIf="confirmDialog.type === 'warning'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <svg *ngIf="confirmDialog.type !== 'danger' && confirmDialog.type !== 'warning'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <h3 class="confirm-title">{{ confirmDialog.title }}</h3>
        <p class="confirm-message">{{ confirmDialog.message }}</p>
        <div class="confirm-actions">
          <button class="confirm-btn confirm-btn-cancel" (click)="cancelConfirm()">Cancelar</button>
          <button class="confirm-btn" [ngClass]="{'confirm-btn-danger': confirmDialog.type === 'danger', 'confirm-btn-warning': confirmDialog.type === 'warning', 'confirm-btn-primary': confirmDialog.type !== 'danger' && confirmDialog.type !== 'warning'}" (click)="acceptConfirm()">{{ confirmDialog.confirmText || 'Confirmar' }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Toast Notifications */
    .toast-container { position: fixed; top: 1.5rem; right: 1.5rem; z-index: 9999; display: flex; flex-direction: column; gap: 0.75rem; pointer-events: none; }
    .toast { display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem 1.25rem; border-radius: 12px; background: white; box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08); min-width: 320px; max-width: 420px; pointer-events: auto; animation: toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards; border-left: 4px solid; }
    .toast-enter { animation: toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards; }
    .toast-exit { animation: toastSlideOut 0.3s ease forwards; }
    .toast-success { border-left-color: #22c55e; }
    .toast-error { border-left-color: #ef4444; }
    .toast-info { border-left-color: #3b82f6; }
    .toast-warning { border-left-color: #f59e0b; }
    .toast-icon { flex-shrink: 0; margin-top: 1px; }
    .toast-success .toast-icon { color: #22c55e; }
    .toast-error .toast-icon { color: #ef4444; }
    .toast-info .toast-icon { color: #3b82f6; }
    .toast-warning .toast-icon { color: #f59e0b; }
    .toast-content { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
    .toast-title { font-weight: 600; font-size: 0.9rem; color: #1e293b; }
    .toast-message { font-size: 0.8rem; color: #64748b; line-height: 1.4; }
    .toast-close { background: none; border: none; color: #94a3b8; cursor: pointer; padding: 2px; border-radius: 4px; transition: all 0.15s; flex-shrink: 0; }
    .toast-close:hover { color: #475569; background: #f1f5f9; }
    @keyframes toastSlideIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes toastSlideOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100px); } }

    /* Confirmation Modal */
    .confirm-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(4px); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: overlayFadeIn 0.2s ease; }
    .confirm-modal { background: white; border-radius: 16px; padding: 2rem; max-width: 420px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); text-align: center; animation: modalScaleIn 0.25s cubic-bezier(0.21, 1.02, 0.73, 1); }
    .confirm-icon { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; }
    .confirm-icon.danger { background: #fef2f2; color: #ef4444; }
    .confirm-icon.warning { background: #fffbeb; color: #f59e0b; }
    .confirm-icon.info { background: #eff6ff; color: #3b82f6; }
    .confirm-title { font-size: 1.15rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem 0; }
    .confirm-message { font-size: 0.9rem; color: #64748b; line-height: 1.5; margin: 0 0 1.5rem 0; }
    .confirm-actions { display: flex; gap: 0.75rem; justify-content: center; }
    .confirm-btn { padding: 0.65rem 1.5rem; border-radius: 10px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; border: none; }
    .confirm-btn-cancel { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
    .confirm-btn-cancel:hover { background: #e2e8f0; }
    .confirm-btn-danger { background: #ef4444; color: white; }
    .confirm-btn-danger:hover { background: #dc2626; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
    .confirm-btn-warning { background: #f59e0b; color: white; }
    .confirm-btn-warning:hover { background: #d97706; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); }
    .confirm-btn-primary { background: #0056b3; color: white; }
    .confirm-btn-primary:hover { background: #003d7a; transform: translateY(-1px); }
    @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes modalScaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  confirmDialog: ConfirmDialog = { visible: false, title: '', message: '', type: 'danger' };

  private toastsSub!: Subscription;
  private confirmSub!: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.toastsSub = this.notificationService.toasts$.subscribe(t => this.toasts = t);
    this.confirmSub = this.notificationService.confirm$.subscribe(c => this.confirmDialog = c);
  }

  ngOnDestroy() {
    this.toastsSub?.unsubscribe();
    this.confirmSub?.unsubscribe();
  }

  removeToast(index: number) {
    this.notificationService.removeToast(index);
  }

  acceptConfirm() {
    this.notificationService.acceptConfirm();
  }

  cancelConfirm() {
    this.notificationService.cancelConfirm();
  }
}
