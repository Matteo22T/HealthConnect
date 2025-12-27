import {ChangeDetectorRef, Component, Input} from '@angular/core';
import { DatePipe, NgIf, SlicePipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { utenteDTO } from '../../../../../model/utenteDTO';
import {PrenotazioneService} from '../../../../../service/prenotazione-service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';



@Component({
  selector: 'app-informazioni-medico-paziente',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    SlicePipe,
    UpperCasePipe,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './informazioni-medico-paziente.html',
  styleUrl: './informazioni-medico-paziente.css',
})
export class InformazioniMedicoPaziente {

  @Input({ required: true }) utente: utenteDTO | undefined = undefined;

  nuovaPrenotazione = {
    medico_id: 0,
    paziente_id: 0,
    data_visita: '',
    motivo: ''
  };

  showModal: boolean = false;
  showSuccess: boolean = false;
  nomeMedicoSelezionato: string = '';



  constructor(
    private router: Router, private cd: ChangeDetectorRef, private prenService: PrenotazioneService) {}


  get etaReale(): string | number {
    if (!this.utente || !this.utente.dataNascita) return '--';
    const nascita = new Date(this.utente.dataNascita);
    const oggi = new Date();
    let eta = oggi.getFullYear() - nascita.getFullYear();
    const differenzaMesi = oggi.getMonth() - nascita.getMonth();
    if (differenzaMesi < 0 || (differenzaMesi === 0 && oggi.getDate() < nascita.getDate())) {
      eta--;
    }
    return eta;
  }

  apriChatPaziente(idMedico: number) {
    this.router.navigate(['/paziente/chat'], { queryParams: { medicoId: idMedico } });
  }

  // --- FUNZIONI PRENOTAZIONE ---

  apriPrenotazione(medico: utenteDTO) {
    this.nuovaPrenotazione.medico_id = medico.id;
    this.nomeMedicoSelezionato = medico.nome + ' ' + medico.cognome;
    this.showModal = true;
  }

  chiudiModal() {
    this.showModal = false;
    // Puliamo i campi per la prossima volta
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
    this.chiudiModal();
    this.showSuccess = true;
    this.cd.detectChanges();
  }

  chiudiSuccess() {
    this.showSuccess = false;
    this.cd.detectChanges();
  }

}
