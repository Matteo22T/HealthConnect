import {ChangeDetectorRef, Component, ElementRef, NgZone, OnInit} from '@angular/core';
import {utenteDTO} from '../../../model/utenteDTO';
import {DatePipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../service/auth-service';

@Component({
  selector: 'app-profilo-paziente',
  imports: [
    DatePipe,
    FormsModule,
    NgIf
  ],
  templateUrl: './profilo-paziente.html',
  styleUrl: './profilo-paziente.css',
})
export class ProfiloPaziente implements OnInit {

  paziente: utenteDTO | null = null;
  isEditingPersonal: boolean = false;
  // Copia di backup per annullare le modifiche
  originalPaziente: utenteDTO | null = null;


  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.paziente = this.authService.currentUserValue;
    if (this.paziente) {
      //copio il medico per poter annullare le modifiche
      this.paziente = JSON.parse(JSON.stringify(this.paziente));
    }
  }

  ModificaDatiPersonali() {
    if (!this.isEditingPersonal) {
      this.originalPaziente = JSON.parse(JSON.stringify(this.paziente));
    } else {
      this.paziente = JSON.parse(JSON.stringify(this.originalPaziente));
    }
    this.isEditingPersonal = !this.isEditingPersonal;
  }

  salvaDatiPersonali() {
    if (this.paziente){
      this.authService.modificaEmailETelefono(this.paziente).subscribe({
        next: result => {
          this.originalPaziente = result;
        },
        error: () => console.error("errore nel salvataggio dei dati personali"),
      })
    }
    this.isEditingPersonal = false;
  }
}
