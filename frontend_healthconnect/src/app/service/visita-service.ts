import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {prenotazioneDTO} from '../model/prenotazioneDTO';
import {VisitaDTO} from '../model/visitaDTO';
import {Observable, Subject} from 'rxjs';
import {utenteDTO} from '../model/utenteDTO';

@Injectable({
  providedIn: 'root',
})
export class VisitaService {

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

  private API_URL = "http://localhost:8080/api/visite";

  constructor(private http : HttpClient) {
  }

  getVisiteOdierneByMedico(id: number){
    return this.http.get<VisitaDTO[]>(`${this.API_URL}/oggi/medici/${id}`,{
      withCredentials: true
    });
  }

  getListaPazientiMedico(id: number): Observable<utenteDTO[]>{
    return this.http.get<utenteDTO[]>(`${this.API_URL}/pazienti/medici/${id}`, {
      withCredentials: true
    });
  }

  getVisiteFuturePaziente(id: number): Observable<VisitaDTO[]>{
    return this.http.get<VisitaDTO[]>(`${this.API_URL}/future/pazienti/${id}`, {
      withCredentials: true
    })
  }

  getListaMediciPaziente(id: number): Observable<utenteDTO[]>{
    return this.http.get<utenteDTO[]>(`${this.API_URL}/medici/paziente/${id}`, {
      withCredentials: true
    })
  }

}
