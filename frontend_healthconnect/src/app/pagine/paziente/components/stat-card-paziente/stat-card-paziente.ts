import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

export type StatCardType = 'pending' | 'prescriptions' | 'doctors';


@Component({
  selector: 'app-stat-card-paziente',
  imports: [
    NgClass
  ],
  templateUrl: './stat-card-paziente.html',
  styleUrl: './stat-card-paziente.css',
})
export class StatCardPaziente {
  @Input({ required: true })
  icona: string = '';


  @Input({ required: true })
  contatore: number = 0;


  @Input({ required: true })
  etichetta: string = '';

  @Input()
  tipo: StatCardType = 'pending';

}
