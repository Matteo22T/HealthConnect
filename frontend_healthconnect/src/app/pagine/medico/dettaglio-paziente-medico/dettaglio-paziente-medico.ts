import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {InformazioniPazienteMedico} from '../components/informazioni-paziente-medico/informazioni-paziente-medico';
import {VisitePazienteMedico} from '../components/visite-paziente-medico/visite-paziente-medico';
import {PrescrizioniPazienteMedico} from '../components/prescrizioni-paziente-medico/prescrizioni-paziente-medico';
import {utenteDTO} from '../../../model/utenteDTO';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {VisitaService} from '../../../service/visita-service';
import {UtenteService} from '../../../service/utente-service';
import {AuthService} from '../../../service/auth-service';
import {forkJoin} from 'rxjs';
import {VisitaDTO} from '../../../model/visitaDTO';
import {VisitaDettaglioDTO} from '../../../model/visitaDettaglioDTO';
import {prescrizioneDTO} from '../../../model/prescrizioneDTO';

@Component({
  selector: 'app-dettaglio-paziente-medico',
  imports: [
    InformazioniPazienteMedico,
    VisitePazienteMedico,
    PrescrizioniPazienteMedico,
    RouterLink
  ],
  templateUrl: './dettaglio-paziente-medico.html',
  styleUrl: './dettaglio-paziente-medico.css',
})
export class DettaglioPazienteMedico implements OnInit{


  paziente: utenteDTO | undefined
  visite: VisitaDettaglioDTO[] = []
  prescrizioniPaziente: prescrizioneDTO[] = []

  constructor(private route: ActivatedRoute, private visService: VisitaService, private changeDet: ChangeDetectorRef, private utService: UtenteService, private auth: AuthService) {}

  ngOnInit() {
    const pazienteId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.auth.currentUserValue;

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
}
