import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Fondamentale per i form
import { MedicoDTO } from '../../../model/medicoDTO';
import { MedicoService } from '../../../service/medico';

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

  showSuccess: boolean = false;

  nuovaPrenotazione = {
    medico_id: 0,
    paziente_id: 1,
    data_visita: '',
    motivo: ''
  };

  constructor(private medicoService: MedicoService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cercaMedici();
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
  }

  // --- FUNZIONI PRENOTAZIONE ---

  apriPrenotazione(medico: MedicoDTO) {
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

      this.medicoService.prenotaVisita(this.nuovaPrenotazione).subscribe({

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
    }
}
