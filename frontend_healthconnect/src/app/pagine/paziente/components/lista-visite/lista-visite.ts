import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {VisitaDTO} from '../../../../model/visitaDTO';
import {SpecializzazioneDTO} from '../../../../model/specializzazioneDTO';
import {SpecializzazioniService} from '../../../../service/specializzazioni-service';
import {REQUIRED} from '@angular/forms/signals';
import {utenteDTO} from '../../../../model/utenteDTO';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-lista-visite',
  imports: [
    DatePipe,
    CommonModule,
    RouterLink
  ],
  templateUrl: './lista-visite.html',
  styleUrl: './lista-visite.css',
})
export class ListaVisite implements OnChanges{

  constructor(private specService: SpecializzazioniService, private changeDet:ChangeDetectorRef) {
  }


  @Input() titolo: string = 'Prossime visite';

  @Input({required: true}) visite: VisitaDTO[] = [];

  visiteMostrate: VisitaDTO[] = [];

  ITEMS_PER_PAGE = 5;
  currentIndex = 0;

  specializzazioni: { [medicoId: number]: string } = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visite'] && this.visite) {
      this.visiteMostrate = [];
      this.currentIndex = 0;

      this.caricaAltriElementi();

      if (this.visite.length > 0) {
        this.caricaSpecializzazioni();
      }
    }
  }

  private caricaSpecializzazioni() {
    // Estrai tutti gli ID specializzazione unici dalle visite
    const specializzazioniIds = [...new Set(this.visite
      .map(visita => {
        if (!visita.medico) return null;
        return visita.medico.specializzazione_id;
      })
      .filter(id => id !== null && id !== undefined))] as number[];

    // Per ogni ID specializzazione, ottieni il nome dal backend
    specializzazioniIds.forEach(specializzazioneId => {
      // Evita chiamate duplicate se già caricata
      if (!this.specializzazioni[specializzazioneId]) {
        this.specService.getSpecializzazione(specializzazioneId).subscribe({
          next: (spec: SpecializzazioneDTO) => {
            // Converte l'ID in nome e lo salva nella mappa
            this.specializzazioni[specializzazioneId] = spec.nome;
            this.changeDet.detectChanges();
          },
          error: (err) => {
            if (err.status === 404) {
              console.error(`Errore 404 specializzazione non trovata per ID ${specializzazioneId}`);
              this.specializzazioni[specializzazioneId] = 'Specializzazione non disponibile';
            } else {
              console.error('Errore server', err);
              this.specializzazioni[specializzazioneId] = 'Errore nel caricamento';
            }
            this.changeDet.detectChanges();
          }
        });
      }
    });
  }

  getSpecializzazione(medico: utenteDTO): string {
    if (!medico || medico.specializzazione_id === null || medico.specializzazione_id === undefined
    ) return '';
    return this.specializzazioni[medico.specializzazione_id] || 'Caricamento...';
  }


  onScroll(event: any) {
    const element = event.target;
    // Verifica se siamo arrivati in fondo (con un margine di tolleranza di 1px)
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 1) {
      this.caricaAltriElementi();
    }
  }

  caricaAltriElementi() {
    if (this.currentIndex >= this.visite.length) return;

    const nextBatch = this.visite.slice(this.currentIndex, this.currentIndex + this.ITEMS_PER_PAGE);
    this.visiteMostrate = [...this.visiteMostrate, ...nextBatch];
    this.currentIndex += this.ITEMS_PER_PAGE;
  }

}


