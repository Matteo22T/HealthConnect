import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoDTO } from '../../../model/medicoDTO'; // Controlla che il percorso sia giusto
import { MedicoService } from '../../../service/medico'; // Controlla che il percorso sia giusto

@Component({
  selector: 'app-trova-medico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trova-medico.html',
  styleUrls: ['./trova-medico.css']
})
export class TrovaMedicoComponent implements OnInit {

  medici: MedicoDTO[] = [];
  searchTerm: string = '';
  selectedSpec: string = '';

  // 👇 1. Aggiungi questa variabile: all'inizio è FALSE (quindi lista accorciata)
  isExpanded: boolean = false;

  constructor(private medicoService: MedicoService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cercaMedici();
  }

  // 👇 2. Aggiungi questo "Getter". È una funzione speciale che Angular usa nell'HTML.
  // Se isExpanded è vero -> restituisce TUTTI i medici.
  // Se è falso -> restituisce solo i primi 5 (slice 0, 5).
  get mediciVisibili(): MedicoDTO[] {
    if (this.isExpanded) {
      return this.medici;
    }
    return this.medici.slice(0, 5);
  }

  // 👇 3. Funzione per il bottone "Vedi tutti"
  toggleVediTutti(): void {
    this.isExpanded = !this.isExpanded; // Inverte vero/falso
  }

  cercaMedici(): void {
    this.medicoService.getMedici(this.searchTerm, this.selectedSpec).subscribe({
      next: (data: MedicoDTO[]) => {
        this.medici = data;
        // 👇 Quando cerchi di nuovo, resettiamo la vista a 5 medici (opzionale)
        this.isExpanded = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error("Errore:", err);
      }
    });
  }
}
