import {Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {GoogleMapsLoaderService} from '../../../../../service/google-maps-loader-service';
import {utenteDTO} from '../../../../../model/utenteDTO';
import {NgClass} from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-specifiche-medico-paziente',
  imports: [
    NgClass
  ],
  templateUrl: './specifiche-medico-paziente.html',
  styleUrl: './specifiche-medico-paziente.css',
})
export class SpecificheMedicoPaziente implements OnInit, AfterViewInit {
  @ViewChild('visualizzaMappa') mapView: ElementRef | undefined;

  @Input({required: true}) medico: utenteDTO | undefined = undefined;


  constructor(private mapsLoader: GoogleMapsLoaderService) {}

  ngOnInit() {
    // Carica Google Maps all'avvio
    this.mapsLoader.load().then(() => {
      console.log('Google Maps caricato con successo');
    }).catch(err => console.error("Maps non caricato", err));
  }

  ngAfterViewInit() {
    // Aspetta che la view sia completamente renderizzata
    setTimeout(() => {
      this.initViewMap();
    }, 500);
  }

  // --- FUNZIONE: Mappa Solo Visualizzazione (View Mode) ---
  async initViewMap() {
    // Controlli di sicurezza
    if (!this.mapView || !this.medico?.indirizzo_studio) {
      console.log('Mappa non inizializzata:', {
        mapView: !!this.mapView,
        indirizzo: this.medico?.indirizzo_studio
      });
      return;
    }

    // Verifica che Google Maps sia caricato
    if (typeof google === 'undefined' || !google.maps) {
      console.error('Google Maps non caricato');
      return;
    }

    try {
      // Importa le librerie necessarie (Maps + Marker + Geocoder)
      const { Map } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
      const { Geocoder } = await google.maps.importLibrary("geocoding");

      console.log('Inizializzazione mappa per indirizzo:', this.medico?.indirizzo_studio);

      const map = new Map(this.mapView.nativeElement, {
        center: { lat: 41.9028, lng: 12.4964 },
        zoom: 15,
        mapId: "DEMO_MAP_ID",

        // Disattiva zoom e controlli di navigazione
        keyboardShortcuts: false,    // Disabilita frecce tastiera
      });

      const geocoder = new Geocoder();
      geocoder.geocode({ 'address': this.medico?.indirizzo_studio }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          console.log('Geocoding riuscito:', results[0].formatted_address);
          map.setCenter(results[0].geometry.location);

          new AdvancedMarkerElement({
            map: map,
            position: results[0].geometry.location,
            title: "Sede studio",
            gmpDraggable: false
          });
        } else {
          console.error('Geocoding fallito:', status);
        }
      });
    } catch (e) {
      console.error("Errore initViewMap", e);
    }
  }
}
