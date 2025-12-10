import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {StatCard} from "../../medico/components/stat-card/stat-card";
import {StatCardPaziente} from '../components/stat-card-paziente/stat-card-paziente';
import {AuthService} from '../../../service/auth-service';
import {PrenotazioneService} from '../../../service/prenotazione-service';
import {VisitaService} from '../../../service/visita-service';
import {prenotazioneDTO} from '../../../model/prenotazioneDTO';
import {forkJoin} from 'rxjs';
import {prescrizioneDTO} from '../../../model/prescrizioneDTO';

@Component({
  selector: 'app-dashboard-paziente',
  imports: [
    StatCardPaziente
  ],
  templateUrl: './dashboard-paziente.html',
  styleUrl: './dashboard-paziente.css',
})
export class DashboardPaziente implements OnInit{
  constructor(private auth: AuthService, private prenotazioneService:PrenotazioneService, private changeDet: ChangeDetectorRef) {}

  prenotazioni: prenotazioneDTO[] = [];

  prescrizioni: prescrizioneDTO[] = [];


  get nomePaziente(): string {
    return this.auth.currentUserValue?.nome || "";
  }


  get cognomePaziente(): string {
    return this.auth.currentUserValue?.cognome || "";
  }

  ngOnInit() {
    const currentUser = this.auth.currentUserValue;

    if (currentUser) {

    }
  }

}
