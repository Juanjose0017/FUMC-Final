import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Toast, ConfirmDialog } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
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
