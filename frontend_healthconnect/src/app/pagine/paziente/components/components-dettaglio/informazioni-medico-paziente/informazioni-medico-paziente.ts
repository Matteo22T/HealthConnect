import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { DatePipe, NgIf, SlicePipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { utenteDTO } from '../../../../../model/utenteDTO';
import {PrenotazioneService} from '../../../../../service/prenotazione-service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../../../../service/auth-service';



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
export class InformazioniMedicoPaziente implements OnInit {

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
  id: number = 0;
  errorMessage: string= "";




  constructor(
    private router: Router, private cd: ChangeDetectorRef, private prenService: PrenotazioneService, private auth: AuthService) {}


  ngOnInit() {
    const currentUser= this.auth.currentUserValue
    if(currentUser){
      this.id=currentUser.id
    }
  }

  // Calcolo dell'età reale basata sulla data di nascita
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


  apriPrenotazione(medico: utenteDTO) {
    this.nuovaPrenotazione.medico_id = medico.id;
    this.nuovaPrenotazione.paziente_id = this.id
    this.nomeMedicoSelezionato = medico.nome + ' ' + medico.cognome;
    this.showModal = true;
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
          this.errorMessage = err.error;
          this.cd.detectChanges();
        }
      }
    });
  }

  get minDate(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
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
