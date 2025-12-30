import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../service/auth-service';
import { utenteDTO } from '../../../model/utenteDTO';
import { SpecializzazioniService } from '../../../service/specializzazioni-service';
import { GoogleMapsService } from '../../../service/google-maps-service';

@Component({
  selector: 'app-profilo-medico',
  standalone: true,
  imports: [CommonModule, NgIf, DatePipe, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profilo-medico.html',
  styleUrl: './profilo-medico.css',
})
export class ProfiloMedico implements OnInit {
  medico: utenteDTO | null = null;
  originalMedico: utenteDTO | null = null;
  nomeSpec: string | undefined;

  isEditingPersonal = false;
  isEditingProfessional = false;

  // Riferimenti alle istanze della mappa e del marker per la modalità modifica
  private editMap: any;
  private editMarker: any;

  @ViewChild('visualizzaMappa') mapView?: ElementRef<HTMLElement>;
  @ViewChild('MappaGoogle') mapContainer?: ElementRef<HTMLElement>;
  // Nota: addressInput serve ancora per l'inizializzazione, ma non aggiungiamo listener manuali qui
  @ViewChild('indirizzoInputUtente') addressInput?: ElementRef<google.maps.places.PlaceAutocompleteElement>;

  constructor(
    private authService: AuthService,
    private specService: SpecializzazioniService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private googleMaps: GoogleMapsService
  ) {}

  ngOnInit(): void {
    this.medico = this.authService.currentUserValue;

    if (this.medico) {
      // Clona l'oggetto per poter annullare le modifiche
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));

      if (this.medico.specializzazione_id != null) {
        this.specService.getSpecializzazione(this.medico.specializzazione_id).subscribe({
          next: (res) => {
            this.nomeSpec = res.nome;
            this.cdr.detectChanges();
          },
          error: () => console.error('Errore caricamento specializzazione'),
        });
      } else {
        this.nomeSpec = 'Nessuna specializzazione';
        this.cdr.detectChanges();
      }
    }

    // Inizializza la mappa statica (view-only) al caricamento
    setTimeout(() => this.initViewMap(), 0);
  }

  // --------------------------------------------------------------------------
  // GESTIONE DATI PERSONALI
  // --------------------------------------------------------------------------

  ModificaDatiPersonali(): void {
    if (!this.isEditingPersonal) {
      // Entra in modifica: salva lo stato attuale per eventuale rollback
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));
    } else {
      // Annulla modifica: ripristina lo stato originale
      this.medico = JSON.parse(JSON.stringify(this.originalMedico));
    }
    this.isEditingPersonal = !this.isEditingPersonal;
  }

  salvaDatiPersonali(): void {
    if (this.medico) {
      this.authService.modificaEmailETelefono(this.medico).subscribe({
        next: (result) => {
          this.originalMedico = result;
          this.isEditingPersonal = false;
        },
        error: () => console.error('Errore nel salvataggio dei dati personali'),
      });
    }
  }

  // --------------------------------------------------------------------------
  // GESTIONE DATI PROFESSIONALI (Con Mappa Interattiva)
  // --------------------------------------------------------------------------

  modificaDatiProfessionali(): void {
    if (!this.isEditingProfessional) {
      // ---> ENTRA IN MODIFICA
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));
      this.isEditingProfessional = true;

      this.cdr.detectChanges();
      // Inizializza la mappa interattiva per la scelta dell'indirizzo
      setTimeout(() => this.initEditMap(), 0);
    } else {
      // ---> ANNULLA MODIFICA
      this.medico = JSON.parse(JSON.stringify(this.originalMedico));
      this.isEditingProfessional = false;

      this.cdr.detectChanges();
      // Ripristina la mappa statica
      setTimeout(() => this.initViewMap(), 0);
    }
  }

  salvaDatiProfessionali(): void {
    if (this.medico) {
      this.authService.modificaIndirizzoEBiografia(this.medico).subscribe({
        next: (result) => {
          this.originalMedico = result;
          this.isEditingProfessional = false;

          this.cdr.detectChanges();
          setTimeout(() => this.initViewMap(), 0);
        },
        error: () => console.error('Errore nel salvataggio dati professionali'),
      });
    }
  }

  /**
   * Metodo collegato all'evento (gmp-placeselect) nell'HTML.
   * Gestisce la selezione di un nuovo indirizzo dall'autocomplete.
   */
  async onAddressSelected(event: any) {
    // Recupera il posto dall'evento (supporta sia evento diretto che custom event)
    const place = event.detail?.place || event.place;

    if (!place) return;

    // Recupera i campi necessari: indirizzo formattato e coordinate (location)
    await place.fetchFields({ fields: ['formattedAddress', 'displayName', 'location'] });

    const address = place.formattedAddress || place.displayName || '';

    // Eseguiamo l'aggiornamento dentro ngZone per assicurarci che Angular rilevi il cambiamento
    this.ngZone.run(() => {
      if (this.medico && address) {
        this.medico.indirizzo_studio = address;

        // Se abbiamo le coordinate, aggiorniamo subito mappa e marker
        if (place.location && this.editMap && this.editMarker) {
          this.editMap.setCenter(place.location);
          this.editMap.setZoom(17);
          this.editMarker.position = place.location;
        } else {
          // Fallback: se location è undefined (raro con fetchFields), usiamo il geocoder
          this.geocodeAndCenter(address);
        }
      }
    });
  }

  // ------------------------
  // VIEW MAP (Mappa Statica - Solo Visualizzazione)
  // ------------------------
  async initViewMap(): Promise<void> {
    if (!this.mapView?.nativeElement) return;
    if (!this.medico?.indirizzo_studio) return;

    try {
      // Carica librerie necessarie
      await this.googleMaps.loadMarker();
      const { Map } = (await google.maps.importLibrary('maps')) as any;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as any;
      const { Geocoder } = (await google.maps.importLibrary('geocoding')) as any;

      // Inizializza mappa
      const map = new Map(this.mapView.nativeElement, {
        center: { lat: 41.9028, lng: 12.4964 }, // Default: Roma
        zoom: 15,
        mapId: 'VIEW_MAP_ID', // ID mappa (crealo in Google Cloud Console per marker avanzati)
        disableDefaultUI: true,
        gestureHandling: 'none',
        keyboardShortcuts: false,
        zoomControl: false,
      });

      // Geocodifica l'indirizzo salvato per posizionare il marker
      const geocoder = new Geocoder();
      geocoder.geocode({ address: this.medico.indirizzo_studio }, (results: any, status: any) => {
        if (status === 'OK' && results?.[0]) {
          map.setCenter(results[0].geometry.location);

          new AdvancedMarkerElement({
            map,
            position: results[0].geometry.location,
            title: 'Sede studio',
            gmpDraggable: false,
          });
        }
      });
    } catch (e) {
      console.error('Errore initViewMap', e);
    }
  }

  // ------------------------
  // EDIT MAP (Mappa Interattiva + Autocomplete)
  // ------------------------
  async initEditMap(): Promise<void> {
    if (!this.mapContainer?.nativeElement) return;

    try {
      // Carichiamo entrambe le librerie (Places per l'input, Marker per la mappa)
      await this.googleMaps.loadPlaces();
      await this.googleMaps.loadMarker();

      const { Map } = (await google.maps.importLibrary('maps')) as any;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as any;
      const { Geocoder } = (await google.maps.importLibrary('geocoding')) as any;

      const defaultLocation = { lat: 41.9028, lng: 12.4964 }; // Roma

      // Creazione mappa interattiva
      this.editMap = new Map(this.mapContainer.nativeElement, {
        center: defaultLocation,
        zoom: 13,
        mapId: 'EDIT_MAP_ID',
        disableDefaultUI: false, // UI abilitata per permettere zoom ecc.
      });

      // Creazione marker
      this.editMarker = new AdvancedMarkerElement({
        map: this.editMap,
        position: defaultLocation,
        title: 'Sede studio',
      });

      // Se il medico ha già un indirizzo, centriamo la mappa su quello
      if (this.medico?.indirizzo_studio) {
        const geocoder = new Geocoder();
        geocoder.geocode({ address: this.medico.indirizzo_studio }, (results: any, status: any) => {
          if (status === 'OK' && results?.[0]) {
            this.editMap.setCenter(results[0].geometry.location);
            this.editMarker.position = results[0].geometry.location;
            this.editMap.setZoom(17);
          }
        });
      }

      // NOTA: Non aggiungiamo più listener manuali qui.
      // L'evento (gmp-placeselect) è gestito direttamente nell'HTML collegato a onAddressSelected().

    } catch (e) {
      console.error('Errore initEditMap', e);
    }
  }

  /**
   * Helper per geocodificare un indirizzo testuale e centrare la mappa (Edit Mode)
   * Usato come fallback se l'oggetto Place non ha geometry.location immediata.
   */
  private async geocodeAndCenter(address: string) {
    if (!this.editMap || !this.editMarker) return;

    const { Geocoder } = (await google.maps.importLibrary('geocoding')) as any;
    const geocoder = new Geocoder();

    geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        this.editMap.setCenter(location);
        this.editMap.setZoom(17);
        this.editMarker.position = location;
      }
    });
  }
}
