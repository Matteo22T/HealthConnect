import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {StatCard} from '../components/stat-card/stat-card';
import {AuthService} from '../../../service/auth-service';
import {prenotazioneDTO} from '../../../model/prenotazioneDTO';
import {PrenotazioneService} from '../../../service/prenotazione-service';
import {VisitaDTO} from '../../../model/visitaDTO';
import {VisitaService} from '../../../service/visita-service';
import {forkJoin} from 'rxjs';
import {utenteDTO} from '../../../model/utenteDTO';
import {MessaggioService} from '../../../service/messaggio-service';
import {MessaggioDTO} from '../../../model/messaggioDTO';
import {ListaRichiesta} from '../components/lista-richiesta/lista-richiesta';


@Component({
  selector: 'app-dashboard-medico',
  imports: [
    StatCard,
    ListaRichiesta
  ],
  templateUrl: './dashboard-medico.html',
  styleUrl: './dashboard-medico.css',
})
export class DashboardMedico implements OnInit{
  constructor(private auth: AuthService, private prenotazioneService:PrenotazioneService, private visitaService: VisitaService,private messaggioService : MessaggioService ,private changeDet: ChangeDetectorRef) {}
  //per le prenotazioni
  prenotazioni: prenotazioneDTO[] = [];

  visite: VisitaDTO[] = [];

  //pazienti medico
  pazienti : utenteDTO[] = []

  //messaggi non letti
  messaggi: MessaggioDTO[] = []

  get cognomeMedico(): string {
    return this.auth.currentUserValue?.cognome || "";
  }

  ngOnInit(){
    const currentUser = this.auth.currentUserValue;

    if (currentUser) {
      forkJoin({
        pren: this.prenotazioneService.getPrenotazioniInAttesaMedico(currentUser.id),
        visit: this.visitaService.getVisiteOdierneByMedico(currentUser.id),
        paz: this.visitaService.getListaPazientiMedico(currentUser.id),
        mex: this.messaggioService.getMessaggiNonLetti(currentUser.id)

      }).subscribe({
        next: result => {
          this.prenotazioni = result.pren;
          console.log(result.pren[0].dataVisita);
          this.visite = result.visit;
          this.pazienti = result.paz;
          this.messaggi = result.mex;
          this.changeDet.detectChanges();
        },
        error: err => {
          if (err.status === 404) {
            console.error('Errore 404 prenotazioni non trovate');
          } else {
            console.error('Errore server', err);
          }
        }
      })
    }
  }

  gestisciAccettazionePrenotazione(idPrenotazione: number){
    this.prenotazioneService.accettaPrenotazione(idPrenotazione).subscribe({
      next: (res) => {
        console.log('Prenotazione accettata', res);
        this.prenotazioni = this.prenotazioni.filter(p => p.id !== idPrenotazione);
        this.changeDet.detectChanges();
      },
      error: (err) => {
        console.error('Errore server', err);
      }
    })
  }

  gestisciRifiutoPrenotazione(idPrenotazione: number){
    this.prenotazioneService.rifiutaPrenotazione(idPrenotazione).subscribe({
      next: (res) => {
        console.log('Prenotazione rifiutata', res);
        this.prenotazioni = this.prenotazioni.filter(p => p.id !== idPrenotazione);
        this.changeDet.detectChanges();
      },
      error: (err) => {
        console.error('Errore server', err);
      }
    })
  }
}
