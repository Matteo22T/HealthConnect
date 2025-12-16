import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {InformazioniPazienteMedico} from '../components/informazioni-paziente-medico/informazioni-paziente-medico';
import {VisitePazienteMedico} from '../components/visite-paziente-medico/visite-paziente-medico';
import {PrescrizioniPazienteMedico} from '../components/prescrizioni-paziente-medico/prescrizioni-paziente-medico';
import {utenteDTO} from '../../../model/utenteDTO';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {VisitaService} from '../../../service/visita-service';
import {UtenteService} from '../../../service/utente-service';
import {AuthService} from '../../../service/auth-service';
import {forkJoin} from 'rxjs';
import {VisitaDettaglioDTO} from '../../../model/visitaDettaglioDTO';
import {prescrizioneDTO} from '../../../model/prescrizioneDTO';
import {AndamentoMetricheVitali} from '../../paziente/components/andamento-metriche-vitali/andamento-metriche-vitali';
import {NgIf} from '@angular/common';
import {AggiungiMetricaForm} from '../aggiungi-metrica-form/aggiungi-metrica-form';
import {MetricheSaluteDTO} from '../../../model/metricheSaluteDTO';
import {MetricheService} from '../../../service/metriche-service';

@Component({
  selector: 'app-dettaglio-paziente-medico',
  imports: [
    InformazioniPazienteMedico,
    VisitePazienteMedico,
    PrescrizioniPazienteMedico,
    RouterLink,
    AndamentoMetricheVitali,
    NgIf,
    AggiungiMetricaForm
  ],
  templateUrl: './dettaglio-paziente-medico.html',
  styleUrl: './dettaglio-paziente-medico.css',
})
export class DettaglioPazienteMedico implements OnInit{


  paziente: utenteDTO | undefined
  visite: VisitaDettaglioDTO[] = []
  prescrizioniPaziente: prescrizioneDTO[] = []
  medico: utenteDTO | null = null

  constructor(private route: ActivatedRoute, private visService: VisitaService, private changeDet: ChangeDetectorRef, private utService: UtenteService, private auth: AuthService, private router: Router, private metricheService: MetricheService) {}

  ngOnInit() {
    const pazienteId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.auth.currentUserValue;
    this.medico = currentUser

    if (currentUser && pazienteId){
      forkJoin({
        paz: this.utService.getUtente(pazienteId),
        vis: this.visService.getVisitePazientePassateByMedico(pazienteId, currentUser.id)
      }).subscribe({
        next: result => {
          this.paziente = result.paz;
          this.visite = result.vis;
          this.getPrescrizioni()
          this.changeDet.detectChanges();
        },
        error: err => {
          console.error('Errore server', err);
        }
      })
    }
  }

  getPrescrizioni(){
    for (let visita of this.visite){
      for (let prescr of visita.prescrizioni){
        this.prescrizioniPaziente.push(prescr)
      }
    }
  }

  apriVisita($event: any) {
    const id_visita: number = $event
    if (id_visita !== null){
      this.router.navigate(['/medico/visite', id_visita])
    }
  }

  metricaAggiunta($event: MetricheSaluteDTO) {
    this.metricheService.salvaNuovaMetrica($event).subscribe({
      next: res => {
        console.log('Metrica salvata con successo', res);
        this.changeDet.detectChanges();
        this.metricheService.triggerRefresh();
      },
      error: err => {
        console.error('Errore server', err);
      }
    })
  }
}
