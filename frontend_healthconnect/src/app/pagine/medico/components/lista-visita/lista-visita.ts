import {Component, Input} from '@angular/core';
import {required} from '@angular/forms/signals';
import {VisitaDTO} from '../../../../model/visitaDTO';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-lista-visita',
  imports: [
    NgIf,
    RouterLink,
    NgForOf,
    DatePipe
  ],
  templateUrl: './lista-visita.html',
  styleUrl: './lista-visita.css',
})
export class ListaVisita {
  @Input({ required: true }) prossimeVisite: VisitaDTO[] = [];
}
