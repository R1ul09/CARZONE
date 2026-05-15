import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { MarcaDetail } from './components/pages/marca-detail/marca-detail';
import { CocheDetail } from './components/pages/coche-detail/coche-detail';
import { Financiacion } from './components/pages/financiacion/financiacion';
import { Comparar } from './components/pages/comparar/comparar';
import { ClienteDashboard } from './components/pages/dashboard/cliente/cliente-dashboard/cliente-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login, data: { noLayout: true } },
  { path: 'register', component: Register, data: { noLayout: true } },
  { path: 'marcas/:id', component: MarcaDetail },
  { path: 'coches/:id', component: CocheDetail },
  { path: 'financiacion', component: Financiacion },
  { path: 'comparar', component: Comparar },
  { path: 'dashboard/cliente', component: ClienteDashboard, canActivate: [authGuard] },
  //{ path: 'dashboard/admin', component: AdminDashboard, canActivate: [authGuard] },
  //{ path: 'dashboard/empleado', component: EmpleadoDashboard, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
