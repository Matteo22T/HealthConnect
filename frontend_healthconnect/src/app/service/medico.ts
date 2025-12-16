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

  getMedici(term: string): Observable<MedicoDTO[]> {
    // IL TRUCCO È QUI:
    // Non mettere nessun "if (!term) return []".
    // Passiamo il termine direttamente. Se è vuoto, il backend ci darà tutti i medici.
    return this.http.get<MedicoDTO[]>(`${this.apiUrl}/trova?search=${term}`);
  }
}
