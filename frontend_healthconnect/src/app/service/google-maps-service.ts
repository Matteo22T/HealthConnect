import { Injectable } from '@angular/core';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { environment } from '../../environments/environment';

//classe singleton
@Injectable({ providedIn: 'root' })
export class GoogleMapsService {
  //capisco se ho configurato o meno il loader
  private configured = false;

  //memorizziamo le chiamate alla libreria (che sarà sempre la stessa)
  private placesPromise?: Promise<google.maps.PlacesLibrary>;
  private markerPromise?: Promise<google.maps.MarkerLibrary>;


  private configurazione(): void {
    //controlliamo se ho già configurato o meno i dati con la key ecc
    if (this.configured) return;

    setOptions({
      key: environment.googleMapsApiKey,
      v: 'weekly',
      language: 'it',
      region: 'IT',
    });

    this.configured = true;
  }

  //
  loadPlaces(): Promise<google.maps.PlacesLibrary> {
    this.configurazione();
    return (this.placesPromise ??= importLibrary('places') as Promise<google.maps.PlacesLibrary>);
  }

  loadMarker(): Promise<google.maps.MarkerLibrary> {
    this.configurazione();
    return (this.markerPromise ??= importLibrary('marker') as Promise<google.maps.MarkerLibrary>);
  }
}
