import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './components/shared/notification.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, NotificationComponent],
    template: `<router-outlet></router-outlet><app-notification></app-notification>`
})
export class AppComponent {
}
