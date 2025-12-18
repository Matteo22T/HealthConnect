import {Component, Input} from '@angular/core';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TimeAgoPipe} from '../../../../../pipes/time-ago-pipe';
import {MessaggioDTO} from '../../../../../model/messaggioDTO';

@Component({
  selector: 'app-messaggi-paziente',
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    SlicePipe,
    TimeAgoPipe
  ],
  templateUrl: './messaggi-paziente.html',
  styleUrl: './messaggi-paziente.css',
})
export class MessaggiPaziente {
  @Input({required: true}) ultimiMessaggi: MessaggioDTO[] = [];
}
