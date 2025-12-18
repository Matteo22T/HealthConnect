import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SpecializzazioneDTO} from '../model/specializzazioneDTO';
import {prenotazioneDTO} from '../model/prenotazioneDTO';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrenotazioneService {
// 1. Crea il "campanello"
  private _refreshNeeded$ = new Subject<void>();

  // 2. Esponilo come Observable (così i componenti possono ascoltare)
  get refreshNeeded$() {
    return this._refreshNeeded$.asObservable();
  }

  // 3. Metodo per suonare il campanello
  triggerRefresh() {
    this._refreshNeeded$.next();
  }

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

  prenotaVisita(datiPrenotazione: any): Observable<any> {
    return this.http.post(`${this.API_URL}/crea`, datiPrenotazione, {withCredentials: true, responseType: 'text' });
  }
}
