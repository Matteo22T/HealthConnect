import { Component } from '@angular/core';
import {MedicoNavbar} from '../medico-navbar/medico-navbar';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-medico-layout',
  imports: [
    MedicoNavbar,
    RouterOutlet
  ],
  templateUrl: './medico-layout.html',
  styleUrl: './medico-layout.css',
})
export class MedicoLayout {

}
