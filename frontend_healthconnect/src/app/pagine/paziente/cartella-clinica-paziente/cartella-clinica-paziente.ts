import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa TUTTI i componenti Tab figli
import { TabStoriaVisite } from '../components/components-cartella/tab-storia-visite/tab-storia-visite';
import { TabPrescrizioni } from '../components/components-cartella/tab-prescrizioni/tab-prescrizioni';
import { TabMetriche } from '../components/components-cartella/tab-metriche/tab-metriche';
import {ActivatedRoute} from '@angular/router';
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
export class CartellaClinicaPaziente implements OnInit{
  activeTab: string = 'visite'; // Tab iniziale

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.activeTab = tab;
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
