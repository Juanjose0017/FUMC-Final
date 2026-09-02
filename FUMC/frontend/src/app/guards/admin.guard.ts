import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    if (!user) {
        return router.parseUrl('/login');
    }

    // Check if user is ADMIN
    if (user.role === 'ADMIN') {
        return true;
    }

    // Not authorized - redirect to regular dashboard
    return router.parseUrl('/dashboard');
};
