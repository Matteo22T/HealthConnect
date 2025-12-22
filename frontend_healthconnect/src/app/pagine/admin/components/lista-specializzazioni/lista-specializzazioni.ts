import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {SpecializzazioniService} from '../../../../service/specializzazioni-service';
import {SpecializzazioneDTO} from '../../../../model/specializzazioneDTO';
import {FormsModule} from '@angular/forms';
import {required} from '@angular/forms/signals';

@Component({
  selector: 'app-lista-specializzazioni',
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './lista-specializzazioni.html',
  styleUrl: './lista-specializzazioni.css',
})
export class ListaSpecializzazioni{
  constructor(private specService: SpecializzazioniService) {}
  @Input({required:true})
  specializzazioni: SpecializzazioneDTO[] = [];

  @Output() onAggiornaLista = new EventEmitter<void>();

  showModal: boolean = false;
  nuovaSpecializzazioneNome: string = '';

  public mostraModale() {
    this.showModal = true;
    this.nuovaSpecializzazioneNome = '';
  }

  public chiudiModale() {
    this.showModal = false;
  }

  public salvaSpecializzazione() {
    this.specService.aggiungiSpecializzazione(this.nuovaSpecializzazioneNome).subscribe({
      next: () => {
        this.chiudiModale()
        this.onAggiornaLista.emit();
      },
      error: (err) => {console.error('Errore server', err)}
    })
  }
}
