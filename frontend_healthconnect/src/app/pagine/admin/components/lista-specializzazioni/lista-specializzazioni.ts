import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { SpecializzazioniService } from '../../../../service/specializzazioni-service';
import { SpecializzazioneDTO } from '../../../../model/specializzazioneDTO';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-specializzazioni',
  imports: [NgIf, NgForOf, FormsModule],
  templateUrl: './lista-specializzazioni.html',
  styleUrl: './lista-specializzazioni.css',
})
export class ListaSpecializzazioni {
  constructor(private specService: SpecializzazioniService, private cd : ChangeDetectorRef) {}

  @Input({ required: true })
  specializzazioni: SpecializzazioneDTO[] = [];

  @Output() onAggiornaLista = new EventEmitter<void>();

  showModal = false;
  nuovaSpecializzazioneNome = '';
  errorMessage = '';

  mostraModale() {
    this.showModal = true;
    this.nuovaSpecializzazioneNome = '';
    this.errorMessage = '';
  }

  chiudiModale() {
    this.showModal = false;
    this.errorMessage = '';
  }

  salvaSpecializzazione() {
    const nome = (this.nuovaSpecializzazioneNome ?? '').trim();

    if (!nome) {
      this.errorMessage = 'Inserisci il nome della specializzazione.';
      return;
    }

    this.errorMessage = '';

    this.specService.aggiungiSpecializzazione(nome).subscribe({
      next: () => {
        this.chiudiModale();
        this.onAggiornaLista.emit();
      },
      error: (err) => {
        const mex =
          err?.error?.message ??
          (typeof err?.error === 'string' ? err.error : '') ??
          err?.message ??
          '';

        const msg = mex.toLowerCase();

        if (msg.includes('esiste')) {
          this.errorMessage = 'Questa specializzazione esiste già.';
        } else {
          this.errorMessage = mex || 'Errore durante il salvataggio';
        }
        this.cd.detectChanges();

        console.error('Errore server', err);
      },
    });
  }
}
