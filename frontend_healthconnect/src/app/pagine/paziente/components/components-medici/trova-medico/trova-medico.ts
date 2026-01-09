import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoDTO } from '../../../../../model/medicoDTO';
import { MedicoService } from '../../../../../service/medico-service';
import {PrenotazioneService} from '../../../../../service/prenotazione-service';
import {AuthService} from '../../../../../service/auth-service';
import {utenteDTO} from '../../../../../model/utenteDTO';
import { Router } from '@angular/router';
import {SpecializzazioneDTO} from '../../../../../model/specializzazioneDTO';
import {SpecializzazioniService} from '../../../../../service/specializzazioni-service';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';


@Component({
  selector: 'app-trova-medico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trova-medico.html',
  styleUrls: ['./trova-medico.css']
})
export class TrovaMedicoComponent implements OnInit {

  medici: MedicoDTO[] = [];
  searchTerm: string = '';
  selectedSpec: string = '';
  isExpanded: boolean = false;
  showModal: boolean = false;
  nomeMedicoSelezionato: string = '';
  errorMessage: string = '';

  specializzazioni: SpecializzazioneDTO[] = []
  showSuccess: boolean = false;

  nuovaPrenotazione = {
    medico_id: 0,
    paziente_id: 0,
    data_visita: '',
    motivo: ''
  };

  constructor(private specializzazioniService: SpecializzazioniService, private cdr: ChangeDetectorRef,private auth: AuthService, private medicoService: MedicoService,private prenService: PrenotazioneService, private cd: ChangeDetectorRef, private router: Router) {}

  pazienteAttuale :utenteDTO = {} as utenteDTO;

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.specializzazioniService.getAllSpecializzazioni().subscribe({
      next: (res) => {
        this.specializzazioni = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Errore caricamento specializzazioni", err)
      }
    })
    this.cercaMedici();
    const currentUser = this.auth.currentUserValue;
    if(currentUser){
      this.pazienteAttuale = currentUser
    }

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.searchTerm = searchValue;
      this.cercaMedici();
    });
  }

  onSearchInput(valore: string): void {
    this.searchSubject.next(valore);
  }

  get mediciVisibili(): MedicoDTO[] {
    if (this.isExpanded) return this.medici;
    return this.medici.slice(0, 5);
  }

  toggleVediTutti(): void {
    this.isExpanded = !this.isExpanded;
  }

  cercaMedici(): void {
    this.medicoService.getMedici(this.searchTerm, this.selectedSpec).subscribe({
      next: (data) => {
        this.medici = data;
        this.isExpanded = false;
        this.cd.detectChanges();
      },
      error: (err) => console.error("Errore:", err)
    });
    this.cd.detectChanges()
  }

  contattaMedico(medicoId: number) {
      this.router.navigate(['/paziente/chat'], {
        queryParams: { medicoId: medicoId }
      });
    }
  // --- FUNZIONI PRENOTAZIONE ---

  apriPrenotazione(medico: MedicoDTO) {
    this.nuovaPrenotazione.medico_id = medico.id;
    this.nuovaPrenotazione.paziente_id = this.pazienteAttuale.id
    this.nomeMedicoSelezionato = medico.nome + ' ' + medico.cognome;
    this.showModal = true;
    this.errorMessage = '';
  }

  chiudiModal() {
    this.showModal = false;
    // Puliamo i campi per la prossima volta
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
      this.cd.detectChanges();
    }

  apriProfilo(med: MedicoDTO) {
    this.router.navigate(['/paziente/medico', med.id]);
  }

  get minDate(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }
}
