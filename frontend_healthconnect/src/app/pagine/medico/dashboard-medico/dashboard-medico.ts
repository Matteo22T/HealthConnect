import { Component } from '@angular/core';
import {StatCard} from '../components/stat-card/stat-card';
import {AuthService} from '../../../service/auth-service';

@Component({
  selector: 'app-dashboard-medico',
  imports: [
    StatCard
  ],
  templateUrl: './dashboard-medico.html',
  styleUrl: './dashboard-medico.css',
})
export class DashboardMedico {
  constructor(protected auth: AuthService) {}

  get cognomeMedico(): string {
    return this.auth.currentUserValue?.cognome || "";
  }
}
