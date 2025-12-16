import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { MetricheSaluteDTO } from '../model/metricheSaluteDTO';

@Injectable({
  providedIn: 'root'
})
export class MetricheService {
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

  private API_URL = 'http://localhost:8080/api/metriche-salute';

  constructor(private http: HttpClient) {}

  getMetricheUltimi6Mesi(pazienteId: number): Observable<MetricheSaluteDTO[]> {
    return this.http.get<MetricheSaluteDTO[]>(`${this.API_URL}/paziente/${pazienteId}/ultimi-6-mesi`, {
      withCredentials: true
    });
  }

  salvaNuovaMetrica(metrica: MetricheSaluteDTO){
    return this.http.post<boolean>(`${this.API_URL}/medico/inserisci`, metrica, {withCredentials: true});
  }
}
