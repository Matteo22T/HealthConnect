import {ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {CommonModule, DatePipe, NgIf} from '@angular/common';
import { AuthService } from '../../../service/auth-service';
import { utenteDTO } from '../../../model/utenteDTO';
import {SpecializzazioniService} from '../../../service/specializzazioni-service';
import {FormsModule} from '@angular/forms';

declare var google: any;
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

  // Riferimento all'input nell'HTML
  @ViewChild('addressInput') addressInput: ElementRef | undefined;
  constructor(private authService: AuthService, private specService: SpecializzazioniService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

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

  // --- MODIFICA QUI ---
  modificaDatiProfessionali() {
    if (!this.isEditingProfessional) {
      // Entro in modalità modifica
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));
      this.isEditingProfessional = true;

      // Importante: forziamo il rilevamento modifiche per far apparire l'input nel DOM
      this.cdr.detectChanges();

      // Ora che l'input esiste, inizializziamo Google Maps
      this.initAutocomplete();

    } else {
      // Annullo le modifiche
      this.medico = JSON.parse(JSON.stringify(this.originalMedico));
      this.isEditingProfessional = false;
    }
  }

  // Funzione per inizializzare Google Places Autocomplete
  // Sostituisci la tua funzione initAutocomplete con questa versione moderna
  async initAutocomplete() {
    if (!this.addressInput) return;

    // Carica la libreria Places dinamicamente
    const { Autocomplete } = await google.maps.importLibrary("places");

    const autocomplete = new Autocomplete(this.addressInput.nativeElement, {
      types: ['address'],
      componentRestrictions: { country: 'it' }
    });

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        if (place.geometry && this.medico) {
          this.medico.indirizzo_studio = place.formatted_address;
        }
      });
    });
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
