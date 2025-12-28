import {ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../service/auth-service';
import { utenteDTO } from '../../../model/utenteDTO';
import { SpecializzazioniService } from '../../../service/specializzazioni-service';
import { GoogleMapsService, PlacesAutocompleteHandle } from '../../../service/google-maps-service';

@Component({
  selector: 'app-profilo-medico',
  standalone: true,
  imports: [CommonModule, NgIf, DatePipe, FormsModule],
  templateUrl: './profilo-medico.html',
  styleUrl: './profilo-medico.css',
})
export class ProfiloMedico implements OnInit {
  medico: utenteDTO | null = null;
  originalMedico: utenteDTO | null = null;
  nomeSpec: string | undefined;

  isEditingPersonal = false;
  isEditingProfessional = false;

  // istanze map/marker edit
  private editMap: any;
  private editMarker: any;

  private placesHandle?: PlacesAutocompleteHandle;

  // Riferimenti all'HTML
  @ViewChild('visualizzaMappa') mapView?: ElementRef<HTMLElement>;
  @ViewChild('MappaGoogle') mapContainer?: ElementRef<HTMLElement>;
  @ViewChild('indirizzoInputUtente') addressInput?: ElementRef<HTMLInputElement>;

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

    // Avvia la mappa view quando il DOM è pronto
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
        },
        error: () => console.error('errore nel salvataggio dei dati personali'),
      });
    }
    this.isEditingPersonal = false;
  }

  modificaDatiProfessionali(): void {
    if (!this.isEditingProfessional) {
      // entra in modifica
      this.originalMedico = JSON.parse(JSON.stringify(this.medico));
      this.isEditingProfessional = true;
      this.cdr.detectChanges();

      setTimeout(() => this.initEditMap(), 0);
    } else {
      // annulla modifica
      this.medico = JSON.parse(JSON.stringify(this.originalMedico));
      this.isEditingProfessional = false;

      // cleanup autocomplete edit
      this.destroyEditAutocomplete();

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

          // cleanup autocomplete edit
          this.destroyEditAutocomplete();

          this.cdr.detectChanges();
          setTimeout(() => this.initViewMap(), 0);
        },
        error: () => console.error('errore nel salvataggio'),
      });
    }
  }

  // ------------------------
  // VIEW MAP (solo visualizzazione)
  // ------------------------
  async initViewMap(): Promise<void> {
    if (!this.mapView?.nativeElement) return;
    if (!this.medico?.indirizzo_studio) return;

    try {
      // importa librerie
      await this.googleMaps.loadMarker();
      await this.googleMaps.loadPlaces(); // non obbligatoria qui, ma ok se usi geocoding altrove

      const { Map } = (await google.maps.importLibrary('maps')) as any;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as any;
      const { Geocoder } = (await google.maps.importLibrary('geocoding')) as any;

      const map = new Map(this.mapView.nativeElement, {
        center: { lat: 41.9028, lng: 12.4964 },
        zoom: 15,
        mapId: 'DEMO_MAP_ID',
        disableDefaultUI: true,
        gestureHandling: 'none',
        keyboardShortcuts: false,
        zoomControl: false,
      });

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
  // EDIT MAP (mappa + input autocomplete)
  // ------------------------
  async initEditMap(): Promise<void> {
    if (!this.addressInput?.nativeElement) return;
    if (!this.mapContainer?.nativeElement) return;

    try {
      // carica librerie necessarie
      await this.googleMaps.loadPlaces();
      await this.googleMaps.loadMarker();

      const { Map } = (await google.maps.importLibrary('maps')) as any;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as any;
      const { Geocoder } = (await google.maps.importLibrary('geocoding')) as any;

      const defaultLocation = { lat: 41.9028, lng: 12.4964 };

      this.editMap = new Map(this.mapContainer.nativeElement, {
        center: defaultLocation,
        zoom: 13,
        mapId: 'DEMO_MAP_ID',
        disableDefaultUI: false,
      });

      this.editMarker = new AdvancedMarkerElement({
        map: this.editMap,
        position: defaultLocation,
        title: 'Sede studio',
      });

      // se c'è già indirizzo, centra
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

      // autocomplete su input normale (stessa UI del register)
      this.destroyEditAutocomplete();
      this.placesHandle = await this.googleMaps.mountAutocompleteOnInput(
        this.addressInput.nativeElement,
        (address: string) => {
          this.ngZone.run(() => {
            if (this.medico) this.medico.indirizzo_studio = address;

            // prova a geocodificare e spostare marker
            const geocoder = new Geocoder();
            geocoder.geocode({ address }, (results: any, status: any) => {
              if (status === 'OK' && results?.[0]) {
                this.editMap.setCenter(results[0].geometry.location);
                this.editMap.setZoom(17);
                this.editMarker.position = results[0].geometry.location;
              }
            });
          });
        }
      );
    } catch (e) {
      console.error('Errore initEditMap', e);
    }
  }

  private destroyEditAutocomplete(): void {
    this.placesHandle?.destroy();
    this.placesHandle = undefined;
  }
}
