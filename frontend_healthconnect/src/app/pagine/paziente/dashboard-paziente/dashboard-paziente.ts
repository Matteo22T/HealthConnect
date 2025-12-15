import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {StatCardPaziente} from '../components/stat-card-paziente/stat-card-paziente';
import {AuthService} from '../../../service/auth-service';
import {VisitaService} from '../../../service/visita-service';
import {forkJoin} from 'rxjs';
import {prescrizioneDTO} from '../../../model/prescrizioneDTO';
import {VisitaDTO} from '../../../model/visitaDTO';
import {ListaVisite} from '../components/lista-visite/lista-visite';
import {ListaPrescrizioni} from '../components/lista-prescrizioni/lista-prescrizioni';
import {PrescrizioniService} from '../../../service/prescrizioni-service';
import {utenteDTO} from '../../../model/utenteDTO';
import {AndamentoMetricheVitali} from '../components/andamento-metriche-vitali/andamento-metriche-vitali';
import {MessaggioDTO} from '../../../model/messaggioDTO';
import {MessaggioService} from '../../../service/messaggio-service';
import {MessaggiPaziente} from '../components/messaggi-paziente/messaggi-paziente';
import {MediciPaziente} from '../components/medici-paziente/medici-paziente';

@Component({
  selector: 'app-dashboard-paziente',
  imports: [
    StatCardPaziente,
    ListaVisite,
    ListaPrescrizioni,
    AndamentoMetricheVitali,
    MessaggiPaziente,
    MediciPaziente
  ],
  templateUrl: './dashboard-paziente.html',
  styleUrl: './dashboard-paziente.css',
})
export class DashboardPaziente implements OnInit{
  constructor(private auth: AuthService,private messaggioService:MessaggioService, private visitaService:VisitaService, private prescService:PrescrizioniService,private changeDet: ChangeDetectorRef) {}

  visite: VisitaDTO[] = [];

  prescrizioni: prescrizioneDTO[] = [];

  medici: utenteDTO[] = [];

  messaggi: MessaggioDTO[] = []

  user: utenteDTO = {} as utenteDTO;



  get nomePaziente(): string {
    return this.auth.currentUserValue?.nome || "";
  }


  get cognomePaziente(): string {
    return this.auth.currentUserValue?.cognome || "";
  }

  ngOnInit() {
    const currentUser = this.auth.currentUserValue;


    if (currentUser) {
      this.user=currentUser;

      forkJoin({
        visit: this.visitaService.getVisiteFuturePaziente(currentUser.id),
        presc: this.prescService.getPrescrizioni(currentUser.id),
        medic: this.visitaService.getListaMediciPaziente(currentUser.id),
        mex: this.messaggioService.getMessaggiNonLetti(currentUser.id)
      }).subscribe({
        next: result => {
          this.visite=result.visit
          this.prescrizioni=result.presc
          this.medici=result.medic
          this.messaggi = result.mex
          this.changeDet.detectChanges()
        },
        error: err => {
          console.error('Errore server', err);
        }
      })

    }
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
