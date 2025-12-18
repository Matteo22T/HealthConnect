import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicoDTO } from '../model/medicoDTO';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private apiUrl = 'http://localhost:8080/api/medici';

  constructor(private http: HttpClient) { }

  getMedici(term: string, spec: string): Observable<MedicoDTO[]> {
      const safeSpec = spec ? spec : '';
      return this.http.get<MedicoDTO[]>(`${this.apiUrl}/trova?search=${term}&spec=${safeSpec}`, {withCredentials: true});
  }
}
