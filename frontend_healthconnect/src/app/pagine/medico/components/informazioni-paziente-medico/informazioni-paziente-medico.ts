import {Component, Input} from '@angular/core';
import {utenteDTO} from '../../../../model/utenteDTO';
import {DatePipe, NgIf, SlicePipe, UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-informazioni-paziente-medico',
  imports: [
    DatePipe,
    NgIf,
    SlicePipe,
    UpperCasePipe
  ],
  templateUrl: './informazioni-paziente-medico.html',
  styleUrl: './informazioni-paziente-medico.css',
})
export class InformazioniPazienteMedico {

  @Input({ required: true}) utente: utenteDTO | undefined = undefined;

  get etaReale(): string | number {
    if (!this.utente || !this.utente.dataNascita) {
      return '--';
    }

    const nascita = new Date(this.utente.dataNascita);
    const oggi = new Date();

    let eta = oggi.getFullYear() - nascita.getFullYear();

    const differenzaMesi = oggi.getMonth() - nascita.getMonth();
    if (differenzaMesi < 0 || (differenzaMesi === 0 && oggi.getDate() < nascita.getDate())) {
      eta--;
    }

    return eta;
  }
}
