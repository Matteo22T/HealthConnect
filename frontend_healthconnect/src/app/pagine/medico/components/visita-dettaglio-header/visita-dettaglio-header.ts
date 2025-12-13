import {Component, Input} from '@angular/core';
import {utenteDTO} from '../../../../model/utenteDTO';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-visita-dettaglio-header',
  imports: [
    DatePipe
  ],
  templateUrl: './visita-dettaglio-header.html',
  styleUrl: './visita-dettaglio-header.css',
})
export class VisitaDettaglioHeader {
  @Input({required:true}) paziente: utenteDTO | undefined;

  @Input({required:true}) data: string | undefined;



}
