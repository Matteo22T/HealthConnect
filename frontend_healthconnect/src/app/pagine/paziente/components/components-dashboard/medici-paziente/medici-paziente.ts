import {Component, Input} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {utenteDTO} from '../../../../../model/utenteDTO';

@Component({
  selector: 'app-medici-paziente',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './medici-paziente.html',
  styleUrl: './medici-paziente.css',
})
export class MediciPaziente {

  constructor(private router: Router) {}


  @Input ({required: true}) medici: utenteDTO[] = [];

  vaiAiMedici(event: Event) {
    event.preventDefault();
    this.router.navigate(['/paziente/medici'], { queryParams: { tab: 'miei' } });
  }
}
