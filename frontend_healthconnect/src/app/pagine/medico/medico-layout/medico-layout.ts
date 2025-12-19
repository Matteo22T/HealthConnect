import { Component } from '@angular/core';
import {MedicoNavbar} from '../medico-navbar/medico-navbar';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from '../../footer/footer';

@Component({
  selector: 'app-medico-layout',
  imports: [
    MedicoNavbar,
    RouterOutlet,
    FooterComponent,
  ],
  templateUrl: './medico-layout.html',
  styleUrl: './medico-layout.css',
})
export class MedicoLayout {

}
