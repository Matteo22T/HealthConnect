import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa TUTTI i componenti Tab figli
import { TabStoriaVisite } from '../components-cartella/tab-storia-visite/tab-storia-visite';
import { TabPrescrizioni } from '../components-cartella/tab-prescrizioni/tab-prescrizioni';
import { TabMetriche } from '../components-cartella/tab-metriche/tab-metriche';
// (Importa anche TabProfilo se/quando lo farai)

@Component({
  selector: 'app-cartella-clinica',
  standalone: true,
  imports: [
    CommonModule,
    TabStoriaVisite,
    TabPrescrizioni,
    TabMetriche
  ],
  templateUrl: './cartella-clinica-paziente.html',
  styleUrl: './cartella-clinica-paziente.css'
})
export class CartellaClinicaPaziente {
  activeTab: string = 'visite'; // Tab iniziale

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
