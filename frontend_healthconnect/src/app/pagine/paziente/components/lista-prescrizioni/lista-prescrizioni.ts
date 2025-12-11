import {Component, Input} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {VisitaDTO} from '../../../../model/visitaDTO';
import {prescrizioneDTO} from '../../../../model/prescrizioneDTO';

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

  @Input() titolo: string = 'Ultime prescrizioni';

  @Input({required: true}) prescrizioni: prescrizioneDTO[] = [];


}
