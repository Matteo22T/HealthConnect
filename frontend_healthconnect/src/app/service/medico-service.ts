import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicoDTO } from '../model/medicoDTO';
import {utenteDTO} from '../model/utenteDTO';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private apiUrl = 'http://localhost:8080/api/medici';

  constructor(private http: HttpClient) { }

  getMedici(term: string, spec: string): Observable<utenteDTO[]> {
      const safeSpec = spec ? spec : '';
      return this.http.get<utenteDTO[]>(`${this.apiUrl}/trova?search=${term}&spec=${safeSpec}`, {withCredentials: true});
  }

  getMedicoById(id: number): Observable<utenteDTO> {
      return this.http.get<utenteDTO>(`${this.apiUrl}/${id}`);
    }
}
