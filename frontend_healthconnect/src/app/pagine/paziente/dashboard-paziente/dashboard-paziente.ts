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

@Component({
  selector: 'app-dashboard-paziente',
  imports: [
    StatCardPaziente,
    ListaVisite,
    ListaPrescrizioni,
    AndamentoMetricheVitali
  ],
  templateUrl: './dashboard-paziente.html',
  styleUrl: './dashboard-paziente.css',
})
export class DashboardPaziente implements OnInit{
  constructor(private auth: AuthService, private visitaService:VisitaService, private prescService:PrescrizioniService,private changeDet: ChangeDetectorRef) {}

  visite: VisitaDTO[] = [];

  prescrizioni: prescrizioneDTO[] = [];

  medici: utenteDTO[] = [];


  get nomePaziente(): string {
    return this.auth.currentUserValue?.nome || "";
  }


  get cognomePaziente(): string {
    return this.auth.currentUserValue?.cognome || "";
  }

  ngOnInit() {
    const currentUser = this.auth.currentUserValue;

    if (currentUser) {

      forkJoin({
        visit: this.visitaService.getVisiteFuturePaziente(currentUser.id),
        presc: this.prescService.getPrescrizioni(currentUser.id),
        medic: this.visitaService.getListaMediciPaziente(currentUser.id)
      }).subscribe({
        next: result => {
          this.visite=result.visit
          this.prescrizioni=result.presc
          this.medici=result.medic
          this.changeDet.detectChanges()
        },
        error: err => {
          console.error('Errore server', err);
        }
      })

    }
  }

}
