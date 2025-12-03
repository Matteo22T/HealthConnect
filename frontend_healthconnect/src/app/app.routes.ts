import { Routes } from '@angular/router';
import {Home} from './pagine/home/home';
import {Login} from './pagine/login/login';
import {Register} from './pagine/register/register';

export const routes: Routes = [
  { path: 'login', component: Login},
  { path: 'register', component: Register},
  { path: '**', component: Home}
];
