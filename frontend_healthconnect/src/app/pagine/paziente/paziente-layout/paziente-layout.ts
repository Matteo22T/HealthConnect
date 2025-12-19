import { Component } from '@angular/core';
import {MedicoNavbar} from "../../medico/medico-navbar/medico-navbar";
import {RouterOutlet} from "@angular/router";
import {PazienteNavbar} from '../paziente-navbar/paziente-navbar';
import {FooterComponent} from '../../footer/footer';

@Component({
  selector: 'app-paziente-layout',
  imports: [
    RouterOutlet,
    PazienteNavbar,
    FooterComponent
  ],
  templateUrl: './paziente-layout.html',
  styleUrl: './paziente-layout.css',
})
export class PazienteLayout {

}
