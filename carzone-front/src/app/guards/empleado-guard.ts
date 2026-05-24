import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';

export const empleadoGuard = () => {
    const auth   = inject(Auth);
    const router = inject(Router);
    const user   = auth.user();
    
    if (!user) { router.navigate(['/login']); return false; }
    if (user.role_id !== 3) { router.navigate(['/']); return false; }
    return true;
};