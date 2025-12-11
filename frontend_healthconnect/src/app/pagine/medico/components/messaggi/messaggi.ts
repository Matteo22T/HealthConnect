import {Component, Input} from '@angular/core';
import {MessaggioDTO} from '../../../../model/messaggioDTO';
import {DatePipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TimeAgoPipe} from '../../../../pipes/time-ago-pipe';

@Component({
  selector: 'app-messaggi',
  imports: [
    NgIf,
    RouterLink,
    NgForOf,
    DatePipe,
    SlicePipe,
    TimeAgoPipe
  ],
  templateUrl: './messaggi.html',
  styleUrl: './messaggi.css',
})
export class Messaggi {
  @Input({required: true}) ultimiMessaggi: MessaggioDTO[] = [];
}
