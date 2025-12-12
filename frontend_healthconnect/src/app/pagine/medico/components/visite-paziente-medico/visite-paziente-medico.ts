import {Component, Input} from '@angular/core';
import {VisitaDettaglioDTO} from '../../../../model/visitaDettaglioDTO';
import {DatePipe, NgForOf} from '@angular/common';

@Component({
  selector: 'app-visite-paziente-medico',
  imports: [
    NgForOf,
    DatePipe
  ],
  templateUrl: './visite-paziente-medico.html',
  styleUrl: './visite-paziente-medico.css',
})
export class VisitePazienteMedico {
  @Input({required: true}) visite: VisitaDettaglioDTO[] = [];
}
