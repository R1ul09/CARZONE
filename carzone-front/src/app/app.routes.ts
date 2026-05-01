import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login, data: { noLayout: true } },
  { path: 'register', component: Register, data: { noLayout: true } },
  { path: '**', redirectTo: '' }
];
