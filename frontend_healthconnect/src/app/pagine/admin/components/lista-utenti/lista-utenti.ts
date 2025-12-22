import {Component, Input} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {utenteDTO} from '../../../../model/utenteDTO';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-lista-utenti',
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    NgClass
  ],
  templateUrl: './lista-utenti.html',
  styleUrl: './lista-utenti.css',
})
export class ListaUtenti {

  constructor(private router: Router) {
  }

  @Input ({required: true}) utenti: utenteDTO[] = [];

  vaiAgliUtenti(event: Event) {
    event.preventDefault();
    this.router.navigate(['/paziente/medici'], { queryParams: { tab: 'miei' } });
  }
}
