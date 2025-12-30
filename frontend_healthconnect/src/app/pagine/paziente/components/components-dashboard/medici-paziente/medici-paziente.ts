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
  errorMessage: string = '';


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
    this.errorMessage = '';
  }

  chiudiModal() {
    this.showModal = false;
    this.nuovaPrenotazione.data_visita = '';
    this.nuovaPrenotazione.motivo = '';
  }

  confermaPrenotazione() {
    this.errorMessage = '';

    if (!this.nuovaPrenotazione.data_visita || !this.nuovaPrenotazione.motivo) {
      this.errorMessage = "Per favore compila data e motivo.";
      return;
    }

    const dataSelezionata = new Date(this.nuovaPrenotazione.data_visita);
    const dataOdierna = new Date();
    const ora = dataSelezionata.getHours();

    if (dataSelezionata <= dataOdierna) {
      this.errorMessage = "La data della visita deve essere successiva ad adesso.";
      return;
    }

    if (ora < 8 || ora >= 20) {
      this.errorMessage = "Gli appuntamenti sono disponibili solo dalle 08:00 alle 20:00.";
      return;
    }

    console.log("Invio prenotazione in corso...");
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
          this.errorMessage = "Errore durante la prenotazione. Riprova più tardi.";
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
    this.cd.detectChanges()
  }

  get minDate(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }
}
