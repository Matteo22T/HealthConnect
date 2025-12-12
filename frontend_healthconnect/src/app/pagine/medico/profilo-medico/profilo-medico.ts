import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe, NgIf} from '@angular/common';
import { AuthService } from '../../../service/auth-service';
import { utenteDTO } from '../../../model/utenteDTO';
import {SpecializzazioniService} from '../../../service/specializzazioni-service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-profilo-medico',
  standalone: true,
  imports: [
    CommonModule, NgIf, DatePipe, FormsModule
  ],
  templateUrl: './profilo-medico.html',
  styleUrl: './profilo-medico.css'
})
export class ProfiloMedico implements OnInit {

  medico: utenteDTO|null = null;
  nomeSpec: string | undefined;
  // --- STATI PER LA MODIFICA ---
  isEditingPersonal: boolean = false;
  isEditingProfessional: boolean = false;
  // Copia di backup per annullare le modifiche
  originalMedico: utenteDTO | null = null;

  constructor(private authService: AuthService, private specService: SpecializzazioniService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.medico = this.authService.currentUserValue;

    if (this.medico){
      //copio il medico per poter annullare le modifiche
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));

      if (this.medico.specializzazione_id != null) {
        this.specService.getSpecializzazione(this.medico.specializzazione_id).subscribe({
          next: (res) => {
            this.nomeSpec = res.nome;
            this.cdr.detectChanges();
          }
        })
      }
      else {
        this.nomeSpec = "Nessuna specializzazione";
        this.cdr.detectChanges();
      }
    }
  }

  ModificaDatiPersonali() {
    if (!this.isEditingPersonal) {
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));
    } else {
      this.medico = JSON.parse(JSON.stringify(this.originalMedico));
    }
    this.isEditingPersonal = !this.isEditingPersonal;
  }

  salvaDatiPersonali() {
    if (this.medico){
      this.authService.modificaEmailETelefono(this.medico).subscribe({
        next: result => {
          this.originalMedico = result;
        },
        error: () => console.error("errore nel salvataggio dei dati personali"),
        })
    }
    this.isEditingPersonal = false;
  }

  modificaDatiProfessionali() {
    if (!this.isEditingProfessional) {
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));
    } else {
      this.medico = JSON.parse(JSON.stringify(this.originalMedico));
    }
    this.isEditingProfessional = !this.isEditingProfessional;
  }

  salvaDatiProfessionali() {
    if (this.medico){
      this.authService.modificaIndirizzoEBiografia(this.medico).subscribe({
        next: result => {
          this.originalMedico = result;
        },
        error: () => console.error("errore nel salvataggio dei dati professionali"),
      }
      )
    }
    this.isEditingProfessional = false;
  }
}
