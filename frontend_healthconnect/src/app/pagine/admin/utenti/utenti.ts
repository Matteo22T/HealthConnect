import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {utenteDTO} from '../../../model/utenteDTO';
import {UtenteService} from '../../../service/utente-service';

@Component({
  selector: 'app-utenti',
  imports: [
    DatePipe,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './utenti.html',
  styleUrl: './utenti.css',
})
export class Utenti implements OnInit {
  utenti: utenteDTO[] = []
  pazienti: utenteDTO[] = []
  medici: utenteDTO[] = []

  constructor(private utenteService: UtenteService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.utenteService.getUtenteAll().subscribe({
      next: (res) => {
        this.utenti = res;
        this.dividiUtenti();
        this.cd.detectChanges()
      },
      error: (err) => {
        console.error('Errore server', err);
      }
    })
  }

  dividiUtenti() {
    for (const utente of this.utenti) {
      if (utente.ruolo === 'MEDICO') {
        this.medici.push(utente);
      } else if (utente.ruolo === 'PAZIENTE') {
        this.pazienti.push(utente);
      }
    }
  }
}
