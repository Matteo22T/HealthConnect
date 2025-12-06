import { Routes } from '@angular/router';
import {Home} from './pagine/home/home';
import {Login} from './pagine/login/login';
import {Register} from './pagine/register/register';
import {DashboardPaziente} from './pagine/paziente/dashboard-paziente/dashboard-paziente';
import {DashboardMedico} from './pagine/medico/dashboard-medico/dashboard-medico';
import {DashboardAdmin} from './pagine/admin/dashboard-admin/dashboard-admin';


export const routes: Routes = [
  { path: 'login', component: Login},
  { path: 'register', component: Register},


  {path: 'paziente/dashboard', component: DashboardPaziente},
  {path: 'medico/dashboard', component: DashboardMedico},
  {path: 'admin/dashboard', component: DashboardAdmin},


  { path: '**', component: Home}
];
