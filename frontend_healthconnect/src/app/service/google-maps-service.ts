import { Injectable } from '@angular/core';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleMapsService {
  private configured = false;

  private placesPromise?: Promise<google.maps.PlacesLibrary>;
  private markerPromise?: Promise<google.maps.MarkerLibrary>;

  private ensureConfigured(): void {
    if (this.configured) return;

    setOptions({
      key: environment.googleMapsApiKey,
      v: 'weekly',
      language: 'it',
      region: 'IT',
    });

    this.configured = true;
  }

  loadPlaces(): Promise<google.maps.PlacesLibrary> {
    this.ensureConfigured();
    return (this.placesPromise ??= importLibrary('places') as Promise<google.maps.PlacesLibrary>);
  }

  loadMarker(): Promise<google.maps.MarkerLibrary> {
    this.ensureConfigured();
    return (this.markerPromise ??= importLibrary('marker') as Promise<google.maps.MarkerLibrary>);
  }
}
