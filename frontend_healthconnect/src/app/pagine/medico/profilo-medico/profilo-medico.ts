import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { AuthService } from '../../../service/auth-service';
import { utenteDTO } from '../../../model/utenteDTO';
import { SpecializzazioniService } from '../../../service/specializzazioni-service';
import { FormsModule } from '@angular/forms';
import { GoogleMapsLoaderService } from '../../../service/google-maps-loader-service';

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

  medico: utenteDTO | null = null;
  originalMedico: utenteDTO | null = null;
  nomeSpec: string | undefined;

  isEditingPersonal: boolean = false;
  isEditingProfessional: boolean = false;

  map: any;
  marker: any;

  // Riferimenti all'HTML
  @ViewChild('visualizzaMappa') mapView: ElementRef | undefined;      // Mappa sola visualizzazione
  @ViewChild('MappaGoogle') mapContainer: ElementRef | undefined; // Mappa in modifica (ho corretto il nome, verifica il tuo HTML)
  @ViewChild('indirizzoInputUtente') addressInput: ElementRef | undefined; // Input indirizzo

  constructor(
    private authService: AuthService,
    private specService: SpecializzazioniService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private mapsLoader: GoogleMapsLoaderService // <--- Service Importante
  ) {}

  ngOnInit() {
    this.medico = this.authService.currentUserValue;

    // 1. Carica Google Maps all'avvio
    this.mapsLoader.load().then(() => {
      // Quando è pronto, inizializza la mappa di visualizzazione
      setTimeout(() => {
        this.initViewMap();
      }, 500); // Mezzo secondo di sicurezza per il rendering del DOM
    }).catch(err => console.error("Maps non caricato", err));

    if (this.medico) {
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));

      if (this.medico.specializzazione_id != null) {
        this.specService.getSpecializzazione(this.medico.specializzazione_id).subscribe({
          next: (res) => {
            this.nomeSpec = res.nome;
            this.cdr.detectChanges();
          }
        })
      } else {
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
          // Aggiorna anche il currentUser nel service/localStorage se necessario
        },
        error: () => console.error("errore nel salvataggio dei dati personali"),
      })
    }
    this.isEditingPersonal = false;
  }

  modificaDatiProfessionali() {
    if (!this.isEditingProfessional) {
      // ENTRA IN MODIFICA
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));
      this.isEditingProfessional = true;
      this.cdr.detectChanges(); // Forza aggiornamento HTML

      // Aspetta che appaia l'input e il div della mappa edit
      setTimeout(() => {
        this.initEditMap(); // <--- Chiama la mappa di modifica
      }, 100);

    } else {
      // ANNULLA MODIFICA
      this.medico = JSON.parse(JSON.stringify(this.originalMedico));
      this.isEditingProfessional = false;
      this.cdr.detectChanges();

      // Ripristina la mappa di visualizzazione
      setTimeout(() => {
        this.initViewMap();
      }, 100);
    }
  }

  salvaDatiProfessionali() {
    if (this.medico){
      this.authService.modificaIndirizzoEBiografia(this.medico).subscribe({
        next: result => {
          this.originalMedico = result;
          // Torna in modalità visualizzazione
          this.isEditingProfessional = false;
          this.cdr.detectChanges();
          // Ricarica la mappa di visualizzazione col nuovo indirizzo
          setTimeout(() => this.initViewMap(), 100);
        },
        error: () => console.error("errore nel salvataggio")
      });
    }
  }

  // --- FUNZIONE 1: Mappa Solo Visualizzazione (View Mode) ---
  async initViewMap() {
    // Controlli di sicurezza
    if (!this.mapView || !this.medico?.indirizzo_studio || typeof google === 'undefined') return;

    try {
      // Importa le librerie necessarie (Maps + Marker + Geocoder)
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      const { Geocoder } = await google.maps.importLibrary("geocoding");

      const map = new Map(this.mapView.nativeElement, {
        center: { lat: 41.9028, lng: 12.4964 },
        zoom: 15,
        mapId: "DEMO_MAP_ID",

        //disattiva zoom e controlli di navigazione
        disableDefaultUI: true,      // Nasconde tutti i pulsanti (Zoom, StreetView, ecc.)
        gestureHandling: 'none',     // IMPEDISCE trascinamento e zoom col mouse/dita
        keyboardShortcuts: false,    // Disabilita frecce tastiera
        zoomControl: false,          // Sicurezza extra per nascondere lo zoom
        // ---------------------------------------------
      });

      const geocoder = new Geocoder();
      geocoder.geocode({ 'address': this.medico.indirizzo_studio }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          map.setCenter(results[0].geometry.location);

          new AdvancedMarkerElement({
            map: map,
            position: results[0].geometry.location,
            title: "Sede studio",
            gmpDraggable: false
          });
        }
      });
    } catch (e) {
      console.error("Errore initViewMap", e);
    }
  }

  // --- FUNZIONE 2: Mappa + Autocomplete (Edit Mode) ---
  async initEditMap() {
    // Nota: qui uso mapContainer (quello dentro l'ngIf dell'edit)
    if (!this.addressInput || !this.mapContainer || typeof google === 'undefined') return;

    try {
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      const { Autocomplete } = await google.maps.importLibrary("places");
      const { Geocoder } = await google.maps.importLibrary("geocoding");

      const defaultLocation = { lat: 41.9028, lng: 12.4964 };

      // Crea Mappa
      this.map = new Map(this.mapContainer.nativeElement, {
        center: defaultLocation,
        zoom: 13,
        mapId: "DEMO_MAP_ID",
        disableDefaultUI: false
      });

      // Crea Marker
      this.marker = new AdvancedMarkerElement({
        map: this.map,
        position: defaultLocation,
        title: "Sede studio"
      });

      // Se c'è già un indirizzo, posiziona il marker
      if (this.medico && this.medico.indirizzo_studio) {
        const geocoder = new Geocoder();
        geocoder.geocode({ 'address': this.medico.indirizzo_studio }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            this.map.setCenter(results[0].geometry.location);
            this.marker.position = results[0].geometry.location;
            this.map.setZoom(17);
          }
        });
      }

      // Collega Autocomplete
      const autocomplete = new Autocomplete(this.addressInput.nativeElement, {
        types: ['address'],
        componentRestrictions: { country: 'it' }
      });

      autocomplete.bindTo('bounds', this.map);

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autocomplete.getPlace();

          if (!place.geometry || !place.geometry.location) return;

          if (this.medico) {
            this.medico.indirizzo_studio = place.formatted_address;
          }

          if (place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport);
          } else {
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(17);
          }

          // Aggiorna posizione marker
          this.marker.position = place.geometry.location;
        });
      });

    } catch (e) {
      console.error("Errore initEditMap", e);
    }
  }
}
