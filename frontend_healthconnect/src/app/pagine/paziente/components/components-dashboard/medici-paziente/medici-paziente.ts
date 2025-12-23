import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {utenteDTO} from '../../../../../model/utenteDTO';
import {MedicoDTO} from '../../../../../model/medicoDTO';
import {PrenotazioneService} from '../../../../../service/prenotazione-service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-medici-paziente',
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './medici-paziente.html',
  styleUrl: './medici-paziente.css',
})
export class MediciPaziente {

  constructor(private router: Router, private prenService: PrenotazioneService, private cd: ChangeDetectorRef) {}

  nomeMedicoSelezionato: string = '';

  showModal: boolean = false;

  showSuccess: boolean = false;

  nuovaPrenotazione = {
    medico_id: 0,
    paziente_id: 0,
    data_visita: '',
    motivo: ''
  };

  @Input ({required: true}) medici: utenteDTO[] = [];

  @Input({required: true}) user: number = 0;


  vaiAiMedici(event: Event) {
    event.preventDefault();
    this.router.navigate(['/paziente/medici'], { queryParams: { tab: 'miei' } });
  }

  apriChatMedico(idMedico: number){
    this.router.navigate(['/paziente/chat'], { queryParams: { medicoId: idMedico } });
  }

  apriPrenotazione(medico: utenteDTO) {
    this.nuovaPrenotazione.medico_id = medico.id;
    this.nuovaPrenotazione.paziente_id = this.user
    this.nomeMedicoSelezionato = medico.nome + ' ' + medico.cognome;
    this.showModal = true;
  }

  chiudiModal() {
    this.showModal = false;
    this.nuovaPrenotazione.data_visita = '';
    this.nuovaPrenotazione.motivo = '';
  }

  confermaPrenotazione() {

    if (!this.nuovaPrenotazione.data_visita || !this.nuovaPrenotazione.motivo) {
      alert("Per favore compila data e motivo.");
      return;
    }

    console.log("Invio prenotazione in corso..."); // LOG DI DEBUG
    this.prenService.prenotaVisita(this.nuovaPrenotazione).subscribe({

      next: (response) => {
        console.log("Risposta NEXT ricevuta:", response);
        this.gestisciSuccesso();
      },


      error: (err) => {
        console.log("Risposta ERROR ricevuta:", err);


        if (err.status === 200 || err.status === 201) {
          this.gestisciSuccesso();
        } else {
          console.error("Errore vero:", err);
          alert("Errore durante la prenotazione. Controlla la console.");
        }
      }
    });
  }


  gestisciSuccesso() {
    this.chiudiModal();       // 1. Chiude il form
    this.showSuccess = true;  // 2. Attiva il popup verde
    this.cd.detectChanges();  // 3. FORZA l'aggiornamento della grafica (Fondamentale!)
  }

  chiudiSuccess() {
    this.showSuccess = false;
    this.cd.detectChanges()
  }
}
