import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { utenteDTO } from '../../../../../model/utenteDTO';
import { SpecializzazioniService } from '../../../../../service/specializzazioni-service';
import { SpecializzazioneDTO } from '../../../../../model/specializzazioneDTO';
import { GoogleMapsService } from '../../../../../service/google-maps-service';

@Component({
  selector: 'app-specifiche-medico-paziente',
  standalone: true,
  imports: [],
  templateUrl: './specifiche-medico-paziente.html',
  styleUrl: './specifiche-medico-paziente.css',
})
export class SpecificheMedicoPaziente implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('visualizzaMappa') mapView?: ElementRef<HTMLElement>;

  @Input({ required: true }) medico?: utenteDTO;

  nomeSpecializzazione: string = 'Caricamento...';

  // per evitare re-init inutili quando non cambia nulla
  private lastRenderedAddress: string | undefined;

  constructor(
    private googleMaps: GoogleMapsService,
    private specService: SpecializzazioniService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.trovaSpecializzazione();
  }

  ngAfterViewInit(): void {
    // appena la view è pronta, prova a renderizzare la mappa
    setTimeout(() => this.initViewMap(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['medico']) {
      this.trovaSpecializzazione();

      // se cambia medico/indirizzo, prova a rerenderizzare la mappa
      setTimeout(() => this.initViewMap(), 0);
    }
  }

  // --- MAPPA SOLO VISUALIZZAZIONE ---
  async initViewMap(): Promise<void> {
    const container = this.mapView?.nativeElement;
    const address = this.medico?.indirizzo_studio;

    if (!container || !address) return;

    // evita di reinizializzare se l'indirizzo è lo stesso
    if (this.lastRenderedAddress === address) return;
    this.lastRenderedAddress = address;

    try {
      // assicura configurazione + librerie (coerente col resto dell'app)
      await this.googleMaps.loadMarker();

      const { Map } = (await google.maps.importLibrary('maps')) as any;
      const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as any;
      const { Geocoder } = (await google.maps.importLibrary('geocoding')) as any;

      const map = new Map(container, {
        center: { lat: 41.9028, lng: 12.4964 },
        zoom: 15,
        mapId: 'DEMO_MAP_ID',
        keyboardShortcuts: false,
      });

      const geocoder = new Geocoder();
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results?.[0]) {
          map.setCenter(results[0].geometry.location);

          new AdvancedMarkerElement({
            map,
            position: results[0].geometry.location,
            title: 'Sede studio',
            gmpDraggable: false,
          });
        } else {
          console.error('Geocoding fallito:', status);
        }
      });
    } catch (e) {
      console.error('Errore initViewMap', e);
    }
  }

  trovaSpecializzazione(): void {
    const specId = this.medico?.specializzazione_id;

    if (specId === null || specId === undefined) {
      this.nomeSpecializzazione = 'Non specificata';
      this.cd.detectChanges();
      return;
    }

    this.specService.getAllSpecializzazioni().subscribe({
      next: (lista: SpecializzazioneDTO[]) => {
        const trovata = lista.find((s) => s.id == specId);

        if (trovata) {
          this.nomeSpecializzazione = trovata.nome;
        } else {
          this.nomeSpecializzazione = 'Non trovata';
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Errore recupero specializzazioni', err);
        this.nomeSpecializzazione = 'Errore caricamento';
        this.cd.detectChanges();
      },
    });
  }
}
