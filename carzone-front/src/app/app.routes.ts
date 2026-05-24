import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';
import { MarcaDetail } from './components/pages/marca-detail/marca-detail';
import { CocheDetail } from './components/pages/coche-detail/coche-detail';
import { Financiacion } from './components/pages/financiacion/financiacion';
import { Comparar } from './components/pages/comparar/comparar';
import { ClienteDashboard } from './components/pages/dashboard/cliente/cliente-dashboard/cliente-dashboard';
import { EmpleadoDashboard } from './components/pages/dashboard/empleado/empleado-dashboard/empleado-dashboard';
import { clienteGuard } from './guards/cliente-guard';
import { empleadoGuard } from './guards/empleado-guard';
import { adminGuard } from './guards/admin-guard';
import { AdminDashboard } from './components/pages/dashboard/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: Home },

  // Auth (sin layout/navbar)
  { path: 'login', component: Login, data: { noLayout: true } },
  { path: 'register', component: Register, data: { noLayout: true } },
  { path: 'forgot-password', component: ForgotPassword, data: { noLayout: true } },
  { path: 'reset-password', component: ResetPassword, data: { noLayout: true } },

  // Páginas públicas
  { path: 'marcas/:id', component: MarcaDetail },
  { path: 'coches/:id', component: CocheDetail },
  { path: 'financiacion', component: Financiacion },
  { path: 'comparar', component: Comparar },

  // Dashboards protegidos
  { path: 'dashboard/cliente', component: ClienteDashboard,  canActivate: [clienteGuard] },
  { path: 'dashboard/empleado', component: EmpleadoDashboard, canActivate: [empleadoGuard] },
  { path: 'dashboard/admin', component: AdminDashboard, canActivate: [adminGuard] },

  { path: '**', redirectTo: '' }
];