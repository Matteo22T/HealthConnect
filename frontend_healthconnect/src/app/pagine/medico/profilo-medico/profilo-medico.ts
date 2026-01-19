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

    // mappa statica
    setTimeout(() => this.initViewMap(), 0);
  }


  ModificaDatiPersonali(): void {
    if (!this.isEditingPersonal) {
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));
    } else {
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


  modificaDatiProfessionali(): void {
    if (!this.isEditingProfessional) {
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));
      this.isEditingProfessional = true;

      this.cdr.detectChanges();
      // Inizializza la mappa interattiva per la scelta dell'indirizzo
      setTimeout(() => this.initEditMap(), 0);
    } else {
      this.medico = JSON.parse(JSON.stringify(this.originalMedico));
      this.isEditingProfessional = false;

      this.cdr.detectChanges();
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


  async onAddressSelected(event: any) {
    const prediction = event.placePrediction ?? event.detail?.placePrediction;
    if (!prediction?.toPlace) return;

    const place = prediction.toPlace();

    await place.fetchFields({
      fields: ['formattedAddress', 'displayName', 'location'],
    });

    const formatted = place.formattedAddress;

    const display =
      typeof place.displayName === 'string'
        ? place.displayName
        : place.displayName?.text;

    const address = formatted || display || '';
    if (!address) return;

    this.ngZone.run(() => {
      if (!this.medico) return;

      // aggiorna modello
      this.medico.indirizzo_studio = address;

      // aggiorna anche il valore visibile nel componente
      try {
        this.addressInput?.nativeElement && ((this.addressInput.nativeElement as any).value = address);
      } catch {}

      // aggiorna mappa+marker se abbiamo coordinate
      if (place.location && this.editMap && this.editMarker) {
        this.editMap.setCenter(place.location);
        this.editMap.setZoom(17);
        this.editMarker.position = place.location;
      } else {
        // fallback geocoder
        this.geocodeAndCenter(address);
      }
    });
  }

  async initViewMap(): Promise<void> {
    if (!this.mapView?.nativeElement) return;

    const address = this.medico?.indirizzo_studio?.trim();
    if (!address) return;

    try {
      // Carica librerie dal singleton
      const mapsLib = await this.googleMaps.loadMaps();
      const markerLib = await this.googleMaps.loadMarker();
      const geocodingLib = await this.googleMaps.loadGeocoding();

      // Geocodifica PRIMA
      const geocoder = new geocodingLib.Geocoder();

      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status !== 'OK' || !results?.[0]) {
          console.error('Geocodifica fallita:', status);
          return;
        }

        const loc = results[0].geometry.location;

        //  Crea la mappa DOPO, già centrata correttamente
        const map = new mapsLib.Map(this.mapView!.nativeElement, {
          center: loc,
          zoom: 17,
          mapId: 'DEMO_MAP_ID',

          disableDefaultUI: true,
          draggable: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          keyboardShortcuts: false,
          gestureHandling: 'none'
        });

        //  Marker
        new markerLib.AdvancedMarkerElement({
          map,
          position: loc,
          title: 'Sede studio',
          gmpDraggable: false,
        });
      });
    } catch (e) {
      console.error('Errore initViewMap', e);
    }
  }

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
        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        keyboardShortcuts: false,
        gestureHandling: 'none',

        center: defaultLocation,
        zoom: 13,
        mapId: 'EDIT_MAP_ID',
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
