import {Component, EventEmitter, Input, Output} from '@angular/core';
import {VisitaDettaglioDTO} from '../../../../model/visitaDettaglioDTO';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {VisitaDTO} from '../../../../model/visitaDTO';

@Component({
  selector: 'app-visite-paziente-medico',
  imports: [
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './visite-paziente-medico.html',
  styleUrl: './visite-paziente-medico.css',
})
export class VisitePazienteMedico {
  @Input({required: true}) visite: VisitaDettaglioDTO[] = [];

  @Output()
  apriVisita = new EventEmitter<number>();
}
