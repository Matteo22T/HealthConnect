import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
export class SpecificheMedicoPaziente implements OnInit, AfterViewInit, OnChanges {
  @Input() medico: utenteDTO | undefined;

  @ViewChild('visualizzaMappa') mapView?: ElementRef<HTMLElement>;

  nomeSpecializzazione: string = 'Caricamento...';

  private map?: google.maps.Map;
  private marker?: any; // AdvancedMarkerElement
  private viewReady = false;
  private lastAddress?: string;

  constructor(
    private specService: SpecializzazioniService,
    private cd: ChangeDetectorRef,
    private googleMaps: GoogleMapsService
  ) {}

  ngOnInit(): void {
    this.trovaSpecializzazione();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.tryInitOrUpdateMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['medico']) {
      this.trovaSpecializzazione();
      this.tryInitOrUpdateMap();
    }
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

  private async tryInitOrUpdateMap(): Promise<void> {
    if (!this.viewReady) return;
    if (!this.mapView?.nativeElement) return;

    const address = this.medico?.indirizzo_studio?.trim();
    if (!address) return;

    // evita re-render inutili se l’indirizzo non è cambiato
    if (this.lastAddress === address && this.map) return;
    this.lastAddress = address;

    try {
      // carica librerie
      await this.googleMaps.loadMarker();
      const { Map } = (await google.maps.importLibrary('maps')) as any;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as any;
      const { Geocoder } = (await google.maps.importLibrary('geocoding')) as any;

      // se la mappa non esiste, creala
      if (!this.map) {
        this.map = new Map(this.mapView.nativeElement, {
          center: { lat: 41.9028, lng: 12.4964 }, // fallback Roma
          zoom: 15,
          mapId: 'DEMO_MAP_ID', // metti il tuo mapId se lo hai
          disableDefaultUI: true,
          gestureHandling: 'cooperative',
          keyboardShortcuts: false,
          zoomControl: true,
        });
      }

      const geocoder = new Geocoder();
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results?.[0]) {
          const loc = results[0].geometry.location;

          this.map!.setCenter(loc);
          this.map!.setZoom(17);

          // crea o aggiorna marker
          if (!this.marker) {
            this.marker = new AdvancedMarkerElement({
              map: this.map,
              position: loc,
              title: 'Sede studio',
              gmpDraggable: false,
            });
          } else {
            this.marker.position = loc;
            this.marker.map = this.map;
          }
        } else {
          console.error('Geocodifica fallita:', status);
        }
      });
    } catch (e) {
      console.error('Errore init/update map', e);
    }
  }
}
