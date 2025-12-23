import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {utenteDTO} from '../../../../../model/utenteDTO';
import {AuthService} from '../../../../../service/auth-service';
import {VisitaService} from '../../../../../service/visita-service';
import {NgForOf, NgIf} from '@angular/common';
import {MedicoDTO} from '../../../../../model/medicoDTO';
import {PrenotazioneService} from '../../../../../service/prenotazione-service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-miei-medici',
  imports: [
    NgForOf,
    NgIf,
    FormsModule
  ],
  templateUrl: './miei-medici.html',
  styleUrl: './miei-medici.css',
})
export class MieiMedici implements OnInit{
  medici: utenteDTO[] = [];

  user: utenteDTO = {} as utenteDTO;

  nomeMedicoSelezionato: string = '';

  showModal: boolean = false;

  showSuccess: boolean = false;

  nuovaPrenotazione = {
    medico_id: 0,
    paziente_id: 0,
    data_visita: '',
    motivo: ''
  };

  constructor(private prenService: PrenotazioneService,private auth: AuthService, private visitService:VisitaService, private cd: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit() {
    const currentUser = this.auth.currentUserValue;


    if (currentUser) {
      this.user=currentUser;

      this.nuovaPrenotazione.paziente_id=currentUser.id;

      this.visitService.getListaMediciPaziente(currentUser.id).subscribe({
      next: result => {
        this.medici=result
        this.cd.detectChanges()
      },
      error: err => {
        console.error('Errore server', err);
      }});
    }

  }

  apriPrenotazione(medico: utenteDTO) {
    this.nuovaPrenotazione.medico_id = medico.id;
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

  apriChatMedico(idMedico: number){
    this.router.navigate(['/paziente/chat'], { queryParams: { medicoId: idMedico } });
  }


}
