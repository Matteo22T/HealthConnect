import {Component, Input} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';

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


  @Input ({required: true}) medici: any[] = [];

  vaiAiMedici(event: Event) {
    event.preventDefault();
    this.router.navigate(['/paziente/medici'], { queryParams: { tab: 'miei' } });
  }
}
