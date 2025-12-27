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

  medici: utenteDTO[] = [];
  searchTerm: string = '';
  selectedSpec: string = '';
  isExpanded: boolean = false;
  showModal: boolean = false;
  nomeMedicoSelezionato: string = '';

  specializzazioni: SpecializzazioneDTO[] = []
  showSuccess: boolean = false;

  nuovaPrenotazione = {
    medico_id: 0,
    paziente_id: 0,
    data_visita: '',
    motivo: ''
  };

  constructor(private specializzazioniService: SpecializzazioniService, private cdr: ChangeDetectorRef,private auth: AuthService, private medicoService: MedicoService,private prenService: PrenotazioneService, private cd: ChangeDetectorRef, private router: Router) {}

  pazienteAttuale :utenteDTO | null = null;

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
    this.pazienteAttuale = this.auth.currentUserValue
    if (this.pazienteAttuale){
      this.nuovaPrenotazione.paziente_id = this.pazienteAttuale.id
    }

    this.searchSubject.pipe(
      debounceTime(300), // Aspetta 300ms dopo l'ultima digitazione
      distinctUntilChanged() // Cerca solo se il testo è effettivamente cambiato
    ).subscribe(searchValue => {
      // Qui chiamiamo il servizio con il valore "pulito"
      this.searchTerm = searchValue; // Assicuriamoci che sia sincronizzato
      this.cercaMedici();
    });
  }

  onSearchInput(valore: string): void {
    this.searchSubject.next(valore);
  }

  get mediciVisibili(): utenteDTO[] {
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
