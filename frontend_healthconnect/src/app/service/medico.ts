import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicoDTO } from '../model/medicoDTO';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  // Assicurati che questo URL sia giusto (es. 8080)
  private apiUrl = 'http://localhost:8080/api/medici';

  constructor(private http: HttpClient) { }

  getMedici(term: string, spec: string): Observable<MedicoDTO[]> {
      // Costruiamo l'URL con entrambi i parametri
      // Esempio risultato: .../trova?search=Gregory&spec=0
      const safeSpec = spec ? spec : '';
      return this.http.get<MedicoDTO[]>(`${this.apiUrl}/trova?search=${term}&spec=${safeSpec}`);
  }
}
