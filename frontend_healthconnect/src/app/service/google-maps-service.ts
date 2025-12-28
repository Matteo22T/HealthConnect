import { Injectable } from '@angular/core';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';
import { environment } from '../../environments/environment';

export type PlacesAutocompleteHandle = {
  destroy: () => void;
};

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private configured = false;

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

  async loadPlaces(): Promise<google.maps.PlacesLibrary> {
    this.ensureConfigured();
    return (await importLibrary('places')) as google.maps.PlacesLibrary;
  }

  async loadMarker(): Promise<google.maps.MarkerLibrary> {
    this.ensureConfigured();
    return (await importLibrary('marker')) as google.maps.MarkerLibrary;
  }

  /**
   * Monta l'autocomplete classico di Google Places su un input HTML normale
   * (così eredita gli stessi stili degli altri campi del form).
   */
  async mountAutocompleteOnInput(
    input: HTMLInputElement,
    onAddressSelected: (address: string) => void
  ): Promise<PlacesAutocompleteHandle> {
    this.ensureConfigured();
    await this.loadPlaces();

    const autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ['formatted_address', 'name'],
      types: ['address'],
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const address = place?.formatted_address || place?.name || '';
      if (!address) return;
      onAddressSelected(address);
    });

    return {
      destroy: () => google.maps.event.removeListener(listener),
    };
  }
}
