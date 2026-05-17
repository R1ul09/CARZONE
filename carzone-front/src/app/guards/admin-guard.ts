import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const adminGuard = () => {
    const router = inject(Router);
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        router.navigate(['/login']);
        return false;
    }

    const role_id = JSON.parse(user).role_id;
    if (role_id !== 2) {
        router.navigate(['/']);
        return false;
    }

    return true;
};