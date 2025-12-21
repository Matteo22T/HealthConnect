import {Component, Input} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {prescrizioneDTO} from '../../../../../model/prescrizioneDTO';
import {Router} from '@angular/router';

@Component({
  selector: 'app-lista-prescrizioni',
  imports: [
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './lista-prescrizioni.html',
  styleUrl: './lista-prescrizioni.css',
})
export class ListaPrescrizioni {

  constructor(private router: Router) {}


  @Input() titolo: string = 'Ultime prescrizioni';

  @Input({required: true}) prescrizioni: prescrizioneDTO[] = [];

  vaiAllePrescrizioni(event: Event) {
    event.preventDefault();
    this.router.navigate(['/paziente/cartella'], { queryParams: { tab: 'prescrizioni' } });
  }


}
