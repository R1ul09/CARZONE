import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

export const empleadoGuard = (): boolean | UrlTree => {
    const router = inject(Router);
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (!token || !user) {
        return router.createUrlTree(['/login']);
    }

    const role_id = Number(JSON.parse(user).role_id);
    if (role_id !== 3) {
        return router.createUrlTree(['/']);
    }

    return true;
};