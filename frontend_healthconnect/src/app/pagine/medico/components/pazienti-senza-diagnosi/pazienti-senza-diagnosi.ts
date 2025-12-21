import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {VisitaDTO} from '../../../../model/visitaDTO';

@Component({
  selector: 'app-pazienti-senza-diagnosi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pazienti-senza-diagnosi.html',
  styleUrl: './pazienti-senza-diagnosi.css',
})
export class PazientiSenzaDiagnosi{
  @Input({required: true}) visite: VisitaDTO[] = [];

  @Output()
  apriVisita = new EventEmitter<number>();
}
