import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  PrescrizioniPazienteMedico
} from '../../medico/components/prescrizioni-paziente-medico/prescrizioni-paziente-medico';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {VisitePazienteMedico} from '../../medico/components/visite-paziente-medico/visite-paziente-medico';
import {
  InformazioniMedicoPaziente
} from '../components/components-dettaglio/informazioni-medico-paziente/informazioni-medico-paziente';
import {utenteDTO} from '../../../model/utenteDTO';
import {VisitaDettaglioDTO} from '../../../model/visitaDettaglioDTO';
import {prescrizioneDTO} from '../../../model/prescrizioneDTO';
import {VisitaService} from '../../../service/visita-service';
import {UtenteService} from '../../../service/utente-service';
import {AuthService} from '../../../service/auth-service';
import {forkJoin} from 'rxjs';
import {
  SpecificheMedicoPaziente
} from '../components/components-dettaglio/specifiche-medico-paziente/specifiche-medico-paziente';
import {VisiteMedicoPaziente} from '../components/components-dettaglio/visite-medico-paziente/visite-medico-paziente';

@Component({
  selector: 'app-dettaglio-medico-paziente',
  imports: [
    PrescrizioniPazienteMedico,
    RouterLink,
    InformazioniMedicoPaziente,
    SpecificheMedicoPaziente,
    VisiteMedicoPaziente,
  ],
  templateUrl: './dettaglio-medico-paziente.html',
  styleUrl: './dettaglio-medico-paziente.css',
})
export class DettaglioMedicoPaziente implements OnInit{

  medico: utenteDTO | undefined;
  visite: VisitaDettaglioDTO[] = [];
  prescrizioniMedico: prescrizioneDTO[] = [];
  paziente: utenteDTO | null = null;


  constructor(private route: ActivatedRoute, private visService: VisitaService, private changeDet: ChangeDetectorRef, private utService: UtenteService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const medicoId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.auth.currentUserValue;
    this.paziente = currentUser

    if (currentUser && medicoId){
      forkJoin({
        med: this.utService.getUtente(medicoId),
        vis: this.visService.getVisitePazientePassateByMedico(currentUser.id.toString(), +medicoId)
      }).subscribe({
        next: result => {
          this.medico = result.med;
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
        this.prescrizioniMedico.push(prescr)
      }
    }
  }

}
