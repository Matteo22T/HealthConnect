import {Component, Input} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

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
  @Input ({required: true}) medici: any[] = [];
}
