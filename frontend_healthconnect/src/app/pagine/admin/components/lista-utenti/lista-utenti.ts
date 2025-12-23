import {Component, Input} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {utenteDTO} from '../../../../model/utenteDTO';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-lista-utenti',
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    NgClass,
    RouterLink
  ],
  templateUrl: './lista-utenti.html',
  styleUrl: './lista-utenti.css',
})
export class ListaUtenti {

  constructor() {
  }

  @Input ({required: true}) utenti: utenteDTO[] = [];

}
