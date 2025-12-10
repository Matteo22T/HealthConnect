import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SpecializzazioneDTO} from '../model/specializzazioneDTO';
import {prenotazioneDTO} from '../model/prenotazioneDTO';

@Injectable({
  providedIn: 'root',
})
export class PrenotazioneService {

  private API_URL = "http://localhost:8080/api/prenotazioni";

  constructor(private http: HttpClient) {}

  getPrenotazioniInAttesaMedico(id: number){
    console.log(`${this.API_URL}/medico/${id}`);
    return this.http.get<prenotazioneDTO[]>(`${this.API_URL}/medico/${id}`, {
      withCredentials: true
    });
  }

  accettaPrenotazione(id: number){
    return this.http.patch<Boolean>(`${this.API_URL}/accetta/${id}`, {}, {withCredentials: true});
  }

  rifiutaPrenotazione(id: number){
    return this.http.patch<Boolean>(`${this.API_URL}/rifiuta/${id}`, {}, {withCredentials: true});
  }

}
