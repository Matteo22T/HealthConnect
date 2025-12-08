import { Routes } from '@angular/router';
import {Home} from './pagine/home/home';
import {Login} from './pagine/login/login';
import {Register} from './pagine/register/register';
import {DashboardMedico} from './pagine/medico/dashboard-medico/dashboard-medico';
import { DashboardAdmin } from "./pagine/admin/dashboard-admin/dashboard-admin";
import {DashboardPaziente} from './pagine/paziente/dashboard-paziente/dashboard-paziente';
import {MedicoLayout} from './pagine/medico/medico-layout/medico-layout';



export const routes: Routes = [
  { path: 'login', component: Login},
  { path: 'register', component: Register},

  {path: 'paziente/dashboard', component: DashboardPaziente},
  {path: 'admin/dashboard', component: DashboardAdmin},

  {path: 'medico', component: MedicoLayout, children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardMedico}
    ]},

  { path: '**', component: Home}
];
