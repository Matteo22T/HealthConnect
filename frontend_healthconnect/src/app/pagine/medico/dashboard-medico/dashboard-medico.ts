import { Component } from '@angular/core';
import {StatCard} from '../components/stat-card/stat-card';

@Component({
  selector: 'app-dashboard-medico',
  imports: [
    StatCard
  ],
  templateUrl: './dashboard-medico.html',
  styleUrl: './dashboard-medico.css',
})
export class DashboardMedico {

}
