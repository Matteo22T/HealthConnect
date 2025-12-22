import {Component, EventEmitter, Input, Output} from '@angular/core';
import {StatCardAdmin} from "../stat-card-admin/stat-card-admin";
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-lista-pending',
  imports: [
    StatCardAdmin,
    DatePipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './lista-pending.html',
  styleUrl: './lista-pending.css',
})
export class ListaPending {

  @Input({ required: true })
  mediciDaApprovare: any[] = [];

  @Output()
  accettaMedico = new EventEmitter<number>();

  @Output()
  rifiutaMedico = new EventEmitter<number>();



}
