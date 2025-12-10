import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {prenotazioneDTO} from '../../../../model/prenotazioneDTO';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-lista-richiesta',
  imports: [
    DatePipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './lista-richiesta.html',
  styleUrl: './lista-richiesta.css',
})
export class ListaRichiesta{

  //prendo le prenotazioni in attesa dal componente padre
  @Input({ required: true })
  prenotazioniInAttesa: prenotazioneDTO[] = []

  @Output()
  accettaPrenotazione = new EventEmitter<number>();

  @Output()
  rifiutaPrenotazione = new EventEmitter<number>();

}
