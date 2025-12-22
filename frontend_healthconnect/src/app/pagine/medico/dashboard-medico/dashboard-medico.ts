import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {StatCard} from '../components/stat-card/stat-card';
import {AuthService} from '../../../service/auth-service';
import {prenotazioneDTO} from '../../../model/prenotazioneDTO';
import {PrenotazioneService} from '../../../service/prenotazione-service';
import {VisitaDTO} from '../../../model/visitaDTO';
import {VisitaService} from '../../../service/visita-service';
import {forkJoin} from 'rxjs';
import {MessaggioService} from '../../../service/messaggio-service';
import {MessaggioDTO} from '../../../model/messaggioDTO';
import {ListaRichiesta} from '../components/lista-richiesta/lista-richiesta';
import {ListaVisita} from '../components/lista-visita/lista-visita';
import {Messaggi} from '../components/messaggi/messaggi';
import {PazientiSenzaDiagnosi} from '../components/pazienti-senza-diagnosi/pazienti-senza-diagnosi';
import {Router} from '@angular/router';
import {StatCardPaziente} from '../../paziente/components/components-dashboard/stat-card-paziente/stat-card-paziente';


@Component({
  selector: 'app-dashboard-medico',
  standalone: true,
  imports: [
    StatCard,
    ListaRichiesta,
    ListaVisita,
    Messaggi,
    PazientiSenzaDiagnosi,
  ],
  templateUrl: './dashboard-medico.html',
  styleUrl: './dashboard-medico.css',
})
export class DashboardMedico implements OnInit{
  constructor(private auth: AuthService, private route: Router, private prenotazioneService:PrenotazioneService, private visitaService: VisitaService,private messaggioService : MessaggioService ,private changeDet: ChangeDetectorRef) {}
  //per le prenotazioni
  prenotazioni: prenotazioneDTO[] = [];

  visite: VisitaDTO[] = [];

  //messaggi non letti
  messaggi: MessaggioDTO[] = []

  numeroPazienti : number = 0;

  VisiteSenzaDiagnosi: VisitaDTO[] = [];

  get cognomeMedico(): string {
    return this.auth.currentUserValue?.cognome || "";
  }

  ngOnInit(){
    const currentUser = this.auth.currentUserValue;
    this.visitaService.refreshNeeded$.subscribe(() => {
      this.caricaVisiteOdierne();
    });
    this.visitaService.refreshNeeded$.subscribe(() => {
      this.caricaPazienti();
    });

    if (currentUser) {
      forkJoin({
        pren: this.prenotazioneService.getPrenotazioniInAttesaMedico(currentUser.id),
        visit: this.visitaService.getVisiteOdierneByMedico(currentUser.id),
        paz: this.visitaService.getNumeroPazientiMedico(currentUser.id),
        mex: this.messaggioService.getMessaggiNonLetti(currentUser.id),
        visNoDiagnosi: this.visitaService.getVisiteSenzaDiagnosi(currentUser.id)

      }).subscribe({
        next: result => {
          this.prenotazioni = result.pren;
          this.visite = result.visit;
          this.numeroPazienti = result.paz;
          this.messaggi = result.mex;
          this.VisiteSenzaDiagnosi = result.visNoDiagnosi;
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
        this.visitaService.triggerRefresh();
        this.prenotazioneService.triggerRefresh();
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

  caricaVisiteOdierne() {
    this.visitaService.getVisiteOdierneByMedico(this.auth.currentUserValue!.id) .subscribe({
      next:(res)=>{
        this.visite=res;
        this.changeDet.detectChanges();
      }, error:(err)=>{
        console.error('Errore server', err);
      }
    });
  }

  caricaPazienti(){
    this.visitaService.getNumeroPazientiMedico(this.auth.currentUserValue!.id) .subscribe({
      next:(res)=>{
        this.numeroPazienti=res;
        this.changeDet.detectChanges();
      }, error:(err)=>{
        console.error('Errore server', err);
      }
    });
  }

  apriVisitaSpecifica(idVisita: number){
    this.route.navigate(['/medico/visite', idVisita]);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      element.classList.add('highlight-glow');

      setTimeout(() => {
        element.classList.remove('highlight-glow');
      }, 2000);
    }
  }
}
