import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';
export type StatCardType = 'pending' | 'today' | 'patients' | 'messages';

@Component({
  selector: 'app-stat-card',
  imports: [
    NgClass
  ],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  @Input({ required: true })
  icona: string = '';


  @Input({ required: true })
  contatore: number = 0;


  @Input({ required: true })
  etichetta: string = '';

  //tipo per colore, se non lo imposto di default è pending
  @Input()
  tipo: StatCardType = 'pending';
}
