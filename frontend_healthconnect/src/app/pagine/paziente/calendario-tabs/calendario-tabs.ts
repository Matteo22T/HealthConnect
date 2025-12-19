import {Component, OnInit} from '@angular/core';
import {MieiMedici} from "../components/components-medici/miei-medici/miei-medici";
import {NgIf} from "@angular/common";
import {TrovaMedicoComponent} from "../components/components-medici/trova-medico/trova-medico";
import {ActivatedRoute} from '@angular/router';
import {CalendarioPaziente} from '../components/components-calendario/calendario-paziente/calendario-paziente';
import {
  ListaCalendarioPaziente
} from '../components/components-calendario/lista-calendario-paziente/lista-calendario-paziente';

@Component({
  selector: 'app-calendario-tabs',
  imports: [
    NgIf,
    CalendarioPaziente,
    ListaCalendarioPaziente
  ],
  templateUrl: './calendario-tabs.html',
  styleUrl: './calendario-tabs.css',
})
export class CalendarioTabs implements OnInit{
  activeTab: string = 'calendario';

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
