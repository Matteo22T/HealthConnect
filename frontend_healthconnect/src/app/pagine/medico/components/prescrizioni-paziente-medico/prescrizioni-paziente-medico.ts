import {Component, Input} from '@angular/core';
import {prescrizioneDTO} from '../../../../model/prescrizioneDTO';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-prescrizioni-paziente-medico',
  imports: [
    NgIf,
    NgForOf,
    DatePipe
  ],
  templateUrl: './prescrizioni-paziente-medico.html',
  styleUrl: './prescrizioni-paziente-medico.css',
})
export class PrescrizioniPazienteMedico {
  @Input({required:true}) prescrizioni: prescrizioneDTO[] = []
}
