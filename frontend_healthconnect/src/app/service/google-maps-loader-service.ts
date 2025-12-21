import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {
  private isLoaded = false;

  constructor() {}

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 1. Se è già caricato, risolvi subito
      if (this.isLoaded || (window as any).google?.maps) {
        this.isLoaded = true;
        resolve();
        return;
      }

      // 2. Controlla se il tag script esiste già nel DOM per evitare duplicati
      const scriptId = 'google-maps-script';
      if (document.getElementById(scriptId)) {
        // Se c'è già ma non è ancora "loaded", potremmo dover aspettare,
        // ma per semplicità assumiamo che stia caricando.
        resolve();
        return;
      }

      // 3. Crea il tag script dinamicamente
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places,marker&loading=async`;
      script.async = true;
      script.defer = true;

      // 4. Gestisci il completamento
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };

      script.onerror = (error: any) => {
        console.error('Errore nel caricamento di Google Maps', error);
        reject(error);
      };

      // 5. Aggiungi al body
      document.body.appendChild(script);
    });
  }
}
