import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitaService } from '../../../../../service/visita-service';
import { AuthService } from '../../../../../service/auth-service';
import { PrenotazioneService } from '../../../../../service/prenotazione-service';
import { VisitaDTO } from '../../../../../model/visitaDTO';
import { prenotazioneDTO } from '../../../../../model/prenotazioneDTO';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-lista-calendario-paziente',
  imports: [CommonModule],
  templateUrl: './lista-calendario-paziente.html',
  styleUrl: './lista-calendario-paziente.css',
})
export class ListaCalendarioPaziente implements OnInit {
  visite: VisitaDTO[] = [];
  prenotazioniPending: prenotazioneDTO[] = [];
  prenotazioniRifiutate: prenotazioneDTO[] = [];

  loading = true;

  // Stato delle sezioni (aperte/chiuse)
  sezioniAperte = {
    confermate: true,
    pending: true,
    rifiutate: true
  };

  constructor(
    private visService: VisitaService,
    private auth: AuthService,
    private prenService: PrenotazioneService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.caricaDati();
  }

  caricaDati() {
    const pazienteId = this.auth.currentUserValue?.id;

    if (pazienteId) {
      forkJoin({
        visite: this.visService.getVisiteFuturePaziente(pazienteId),
        prenotazioni: this.prenService.getPrenotazioniInAttesaPaziente(pazienteId),
        prenRifiutate: this.prenService.getPrenotazioniRifiutatePaziente(pazienteId)
      }).subscribe({
        next: (res) => {
          this.visite = res.visite;
          this.prenotazioniPending = res.prenotazioni;
          this.prenotazioniRifiutate = res.prenRifiutate;
          this.loading = false;
          this.cd.detectChanges()
        },
        error: (err) => {
          console.error('Errore nel caricamento dei dati:', err);
          this.loading = false;
          this.cd.detectChanges()
        }
      });
    }
  }

  formatData(data: string): string {
    return new Date(data).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatOrario(data: string): string {
    const date = new Date(data);
    const inizio = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const fine = new Date(date.getTime() + 60 * 60 * 1000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    return `${inizio} - ${fine}`;
  }

  toggleSezione(sezione: 'confermate' | 'pending' | 'rifiutate') {
    this.sezioniAperte[sezione] = !this.sezioniAperte[sezione];
  }
}
