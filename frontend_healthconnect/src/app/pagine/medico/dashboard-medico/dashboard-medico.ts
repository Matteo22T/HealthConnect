import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {StatCard} from '../components/stat-card/stat-card';
import {AuthService} from '../../../service/auth-service';
import {prenotazioneDTO} from '../../../model/prenotazioneDTO';
import {PrenotazioneService} from '../../../service/prenotazione-service';
import {VisitaDTO} from '../../../model/visitaDTO';
import {VisitaService} from '../../../service/visita-service';
import {forkJoin} from 'rxjs';


@Component({
  selector: 'app-dashboard-medico',
  imports: [
    StatCard
  ],
  templateUrl: './dashboard-medico.html',
  styleUrl: './dashboard-medico.css',
})
export class DashboardMedico implements OnInit{
  constructor(private auth: AuthService, private prenotazioneService:PrenotazioneService, private visitaService: VisitaService, private changeDet: ChangeDetectorRef) {}
  //per le prenotazioni
  prenotazioni: prenotazioneDTO[] = [];

  visite: VisitaDTO[] = [];

  get cognomeMedico(): string {
    return this.auth.currentUserValue?.cognome || "";
  }

  ngOnInit(){
    const currentUser = this.auth.currentUserValue;

    if (currentUser) {
      forkJoin({
        pren: this.prenotazioneService.getPrenotazioniInAttesaMedico(currentUser.id),
        visit: this.visitaService.getVisiteOdierneByMedico(currentUser.id)
      }).subscribe({
        next: result => {
          this.prenotazioni = result.pren;
          this.visite = result.visit;
        },
        error: err => {
          if (err.status === 404) {
            console.error('Errore 404 prenotazioni non trovate');
          } else {
            console.error('Errore server', err);
          }
        }
      })












      this.prenotazioneService.getPrenotazioniInAttesaMedico(currentUser.id).subscribe({
        next: (pren )=> {
          this.prenotazioni = pren;
          this.changeDet.detectChanges();
        },
        error: (err) => {
          if (err.status === 404) {
            console.error('Errore 404 prenotazioni non trovate');
          }
          else {
            console.error('Errore server', err);
          }
        }
      })
    }
  }
}
