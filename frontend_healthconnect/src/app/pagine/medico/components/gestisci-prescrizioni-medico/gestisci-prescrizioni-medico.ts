import {Component, Input} from '@angular/core';
import {prescrizioneDTO} from '../../../../model/prescrizioneDTO';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-gestisci-prescrizioni-medico',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    DatePipe
  ],
  templateUrl: './gestisci-prescrizioni-medico.html',
  styleUrl: './gestisci-prescrizioni-medico.css',
})
export class GestisciPrescrizioniMedico {
  @Input({required:true}) prescrizioni: prescrizioneDTO[] = [];
  @Input({required:true}) idVisita: number = 0;

  nuovoFarmaco: prescrizioneDTO = {
    id_visita: this.idVisita,
    dataEmissione: new Date().toISOString().split('T')[0],
  }

  errore = ''

  aggiungi() {
    this.errore = ''

    if (!this.nuovoFarmaco.nome_farmaco ||
      !this.nuovoFarmaco.dosaggio ||
      !this.nuovoFarmaco.dataFine) {

      this.errore = "Attenzione: Compila tutti i campi (Nome, Dosaggio e Data Fine)"
      return;
    }

    const oggi = new Date().toISOString().split('T')[0];

    if (this.nuovoFarmaco.dataFine <= oggi) {
      this.errore = "Errore: La data di fine terapia non può essere nel passato!";
      return;
    }

    this.prescrizioni.unshift({...this.nuovoFarmaco });

    this.resetForm();
  }

  private resetForm() {
    this.nuovoFarmaco = {
      id_visita: this.idVisita,
      nome_farmaco: '',
      dosaggio: '',
      dataFine: '',
      dataEmissione: new Date().toISOString().split('T')[0], // Reimposta a oggi
    }
  }

  rimuovi(index: number) {
    this.prescrizioni.splice(index, 1);
  }
}
