import {Component, Input} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {VisitaDettaglioDTO} from '../../../../../model/visitaDettaglioDTO';

@Component({
  selector: 'app-visite-medico-paziente',
  imports: [
    DatePipe,
    NgForOf,
    NgIf
  ],
  templateUrl: './visite-medico-paziente.html',
  styleUrl: './visite-medico-paziente.css',
})
export class VisiteMedicoPaziente {
  @Input({required: true}) visite: VisitaDettaglioDTO[] = [];
}
