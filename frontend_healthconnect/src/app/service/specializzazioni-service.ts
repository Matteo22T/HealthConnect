import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SpecializzazioneDTO} from '../model/specializzazioneDTO';

@Injectable({
  providedIn: 'root',
})
export class SpecializzazioniService {
  private API_URL = "http://localhost:8080/api/specializzazioni";

  constructor(private http: HttpClient) {
  }

  getSpecializzazione(id:number): Observable<SpecializzazioneDTO> {
    return this.http.get<SpecializzazioneDTO>(`${this.API_URL}/${id}`, {
      withCredentials: true
    });
  }

  getAllSpecializzazioni(): Observable<SpecializzazioneDTO[]> {
    return this.http.get<SpecializzazioneDTO[]>(`${this.API_URL}/all`, {
      withCredentials: true
    });
  }


  aggiungiSpecializzazione(nomeSpec: string) {
    return this.http.post<boolean>(`${this.API_URL}/admin/aggiungi/${nomeSpec}`, {}, {withCredentials: true});
  }
}
