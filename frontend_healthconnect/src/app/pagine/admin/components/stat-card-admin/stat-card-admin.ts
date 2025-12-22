import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';

export type StatCardType = 'pazienti-tot' | 'medici-attivi' | 'visite';


@Component({
  selector: 'app-stat-card-admin',
  imports: [
    NgClass
  ],
  templateUrl: './stat-card-admin.html',
  styleUrl: './stat-card-admin.css',
})
export class StatCardAdmin {

  @Input({ required: true })
  icona: string = '';


  @Input({ required: true })
  contatore: number = 0;


  @Input({ required: true })
  etichetta: string = '';

  @Input()
  tipo: StatCardType = 'pazienti-tot';



}
