import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {TabMetriche} from "../components/components-cartella/tab-metriche/tab-metriche";
import {TabPrescrizioni} from "../components/components-cartella/tab-prescrizioni/tab-prescrizioni";
import {TabStoriaVisite} from "../components/components-cartella/tab-storia-visite/tab-storia-visite";
import {TrovaMedicoComponent} from '../components/components-medici/trova-medico/trova-medico';
import {ActivatedRoute} from '@angular/router';
import {MieiMedici} from '../components/components-medici/miei-medici/miei-medici';

@Component({
  selector: 'app-medici-paziente',
  imports: [
    NgIf,
    TrovaMedicoComponent,
    MieiMedici
  ],
  templateUrl: './medici-tabs.html',
  styleUrl: './medici-tabs.css',
})
export class MediciTabs implements OnInit{
  activeTab: string = 'trova';

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
