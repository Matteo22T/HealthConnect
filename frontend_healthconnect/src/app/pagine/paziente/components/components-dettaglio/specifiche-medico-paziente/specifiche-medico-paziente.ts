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

  // Riferimento all'elemento HTML <div #visualizzaMappa> dove verrà renderizzata la mappa.
  @ViewChild('visualizzaMappa') mapView?: ElementRef<HTMLElement>;

  nomeSpecializzazione: string = 'Caricamento...';

  // Proprietà private per gestire l'istanza della mappa e del segnalino (marker)
  private map?: google.maps.Map;
  private marker?: google.maps.marker.AdvancedMarkerElement;

  // Flag per assicurarsi che l'HTML sia pronto prima di inizializzare la mappa
  private viewReady = false;

  // Ultimo indirizzo geocodificato per evitare ricariche inutili della mappa
  private lastAddress?: string;

  constructor(
    private specService: SpecializzazioniService,
    private cd: ChangeDetectorRef,
    private googleMaps: GoogleMapsService
  ) {}

  ngOnInit(): void {
    this.trovaSpecializzazione();
  }

  //eseguito dopo che Angular ha renderizzato l'HTML.
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

  // Recupera il nome della specializzazione partendo dall'ID numerico presente nel medico.
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

  // Inizializza o aggiorna la mappa Google Maps con il marker basato sull'indirizzo del medico.
  private async tryInitOrUpdateMap(): Promise<void> {
    // Assicura che la vista sia pronta e che l'elemento della mappa esista
    if (!this.viewReady) return;
    if (!this.mapView?.nativeElement) return;

    const address = this.medico?.indirizzo_studio?.trim();
    if (!address) return;

    // Evita di ricaricare la mappa se l'indirizzo non è cambiato
    if (this.lastAddress === address && this.map) return;
    this.lastAddress = address;

    try {
      //carico le librerie necessarie
      const mapsLib = await this.googleMaps.loadMaps();
      const markerLib = await this.googleMaps.loadMarker();
      const geocodingLib = await this.googleMaps.loadGeocoding();

     //geocodifico prima di creare la mappa (ottengo lat/lng dall'indirizzo)
      const geocoder = new geocodingLib.Geocoder();

      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status !== 'OK' || !results?.[0]) {
          console.error('Geocodifica fallita:', status);
          return;
        }

        const loc = results[0].geometry.location;

        //creo la mappa
        if (!this.map) {
          this.map = new mapsLib.Map(this.mapView!.nativeElement, {
            center: loc,
            zoom: 17,
            mapId: 'DEMO_MAP_ID',
            disableDefaultUI: true,
            gestureHandling: 'cooperative',
            keyboardShortcuts: false,
            zoomControl: true,
          });
        } else {
          // se esiste già, aggiorna solo center/zoom
          this.map.setCenter(loc);
          this.map.setZoom(17);
        }

        // marker: crea o aggiorna
        if (!this.marker) {
          this.marker = new markerLib.AdvancedMarkerElement({
            map: this.map!,
            position: loc,
            title: 'Sede studio',
            gmpDraggable: false,
          });
        } else {
          this.marker.position = loc;
          this.marker.map = this.map!;
        }
      });
    } catch (e) {
      console.error('Errore init/update map', e);
    }
  }
}
