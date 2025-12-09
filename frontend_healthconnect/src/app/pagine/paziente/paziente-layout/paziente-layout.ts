import { Component } from '@angular/core';
import {MedicoNavbar} from "../../medico/medico-navbar/medico-navbar";
import {RouterOutlet} from "@angular/router";
import {PazienteNavbar} from '../paziente-navbar/paziente-navbar';

@Component({
  selector: 'app-paziente-layout',
  imports: [
    RouterOutlet,
    PazienteNavbar
  ],
  templateUrl: './paziente-layout.html',
  styleUrl: './paziente-layout.css',
})
export class PazienteLayout {

}
