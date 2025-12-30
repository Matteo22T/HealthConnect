
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { utenteDTO } from '../../../../../model/utenteDTO';
import { SpecializzazioniService } from '../../../../../service/specializzazioni-service';
import { SpecializzazioneDTO } from '../../../../../model/specializzazioneDTO';
import { GoogleMapsService } from '../../../../../service/google-maps-service';

@Component({
  selector: 'app-specifiche-medico-paziente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './specifiche-medico-paziente.html',
  styleUrl: './specifiche-medico-paziente.css',
})
export class SpecificheMedicoPaziente implements OnInit {
  @Input() medico: utenteDTO | undefined;

  @ViewChild('visualizzaMappa') mapView?: ElementRef<HTMLElement>;

  nomeSpecializzazione: string = 'Caricamento...';

  constructor(
    private specService: SpecializzazioniService,
    private cd: ChangeDetectorRef,
    private googleMaps: GoogleMapsService
  ) {}

  ngOnInit(): void {
    this.trovaSpecializzazione();
    // Inizializza la mappa dopo che la view è caricata
    setTimeout(() => this.initViewMap(), 0);
  }

  trovaSpecializzazione(): void {
    const specId = this.medico?.specializzazione_id;

    if (specId === null || specId === undefined) {
      this.nomeSpecializzazione = 'Non specificata';
      this.cd.detectChanges();
      return;
    }

    this.specService.getSpecializzazione(specId).subscribe({
      next: (spec: SpecializzazioneDTO) => {
        this.nomeSpecializzazione = spec.nome;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Errore recupero specializzazione', err);
        this.nomeSpecializzazione = 'Errore caricamento';
        this.cd.detectChanges();
      },
    });
  }

  async initViewMap(): Promise<void> {
    if (!this.mapView?.nativeElement) return;
    if (!this.medico?.indirizzo_studio) return;

    try {
      await this.googleMaps.loadMarker();

      const { Map } = (await google.maps.importLibrary('maps')) as any;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as any;
      const { Geocoder } = (await google.maps.importLibrary('geocoding')) as any;

      const map = new Map(this.mapView.nativeElement, {
        center: { lat: 41.9028, lng: 12.4964 },
        zoom: 15,
        mapId: 'DEMO_MAP_ID',
        disableDefaultUI: true,
        gestureHandling: 'cooperative',
        keyboardShortcuts: false,
        zoomControl: true,
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
        } else {
          console.error('Geocodifica fallita:', status);
        }
      });
    } catch (e) {
      console.error('Errore initViewMap', e);
    }
  }
}
