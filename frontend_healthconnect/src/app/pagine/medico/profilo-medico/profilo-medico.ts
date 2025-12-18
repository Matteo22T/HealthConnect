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
  originalMedico: utenteDTO | null = null;
  nomeSpec: string | undefined;
  isEditingPersonal: boolean = false;
  isEditingProfessional: boolean = false;
  map: any;
  marker: any;

  @ViewChild('indirizzoInputUtente') addressInput: ElementRef | undefined;
  @ViewChild('MappaGoogle') MappaGoogle: ElementRef | undefined;
  constructor(private authService: AuthService, private specService: SpecializzazioniService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit() {
    this.medico = this.authService.currentUserValue;

    if (this.medico){
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
      this.isEditingProfessional = true;
      this.cdr.detectChanges();

      //per maps
      this.initMapAndAutocomplete();

    } else {
      this.medico = JSON.parse(JSON.stringify(this.originalMedico));
      this.isEditingProfessional = false;
    }
  }

  initMapAndAutocomplete() {
    // Controlli di sicurezza
    if (!this.addressInput || !this.MappaGoogle || typeof google === 'undefined') {
      return;
    }

    // 1. CREA LA MAPPA
    const defaultLocation = { lat: 41.9028, lng: 12.4964 }; // Roma (default se vuoto)

    this.map = new google.maps.Map(this.MappaGoogle.nativeElement, {
      center: defaultLocation,
      zoom: 13,
      disableDefaultUI: false // Lascia i controlli zoom ecc.
    });

    // 2. CREA IL MARKER
    this.marker = new google.maps.Marker({
      position: defaultLocation,
      map: this.map,
      draggable: false // Mettilo a true se vuoi permettere di spostarlo a mano
    });

    // 3. SE C'È GIÀ UN INDIRIZZO, CERCA LE COORDINATE (Geocoding)
    if (this.medico && this.medico.indirizzo_studio) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': this.medico.indirizzo_studio }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          this.map.setCenter(results[0].geometry.location);
          this.marker.setPosition(results[0].geometry.location);
          this.map.setZoom(17); // Zoom ravvicinato
        }
      });
    }

    // 4. COLLEGA L'AUTOCOMPLETE
    const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement, {
      types: ['address'],
      componentRestrictions: { country: 'it' }
    });

    // Collega l'autocomplete alla mappa (così se clicchi, la mappa si sposta)
    autocomplete.bindTo('bounds', this.map);

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          return;
        }

        // Aggiorna il modello Angular
        if (this.medico) {
          this.medico.indirizzo_studio = place.formatted_address;
        }

        // Aggiorna la mappa
        if (place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        } else {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(17);
        }

        // Sposta il marker
        this.marker.setPosition(place.geometry.location);
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
