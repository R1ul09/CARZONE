import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor para autenticación SPA con cookies HttpOnly (Sanctum)
 * 1.`withCredentials: true` → el navegador envía automáticamente la cookie
 * de sesión en cada petición al mismo dominio.
 * 2. X-XSRF-TOKEN` → el navegador lo toma de la cookie XSRF-TOKEN (no HttpOnly)
 * que Laravel setea. Angular HttpClient lo añade solo cuando detecta esa cookie,
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Leer el token XSRF que Laravel pone en una cookie accesible
  const xsrfToken = getCookie('XSRF-TOKEN');

  const authReq = req.clone({
    // envía la cookie de sesión HttpOnly
    withCredentials: true,
    setHeaders: xsrfToken
      ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }
      : {}
  });

  return next(authReq);
};

// Helper para leer cookies por nombre
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}