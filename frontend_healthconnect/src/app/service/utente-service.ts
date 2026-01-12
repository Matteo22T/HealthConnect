import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {utenteDTO} from '../model/utenteDTO';
import {Observable, Subject} from 'rxjs';
import {ImpostazioniNotifiche} from '../model/ImpostazioniNotificheDTO';

@Injectable({
  providedIn: 'root',
})
export class UtenteService {
  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$.asObservable();
  }

  triggerRefresh() {
    this._refreshNeeded$.next();
  }

  API_URL = "http://localhost:8080/api/utenti";

  constructor(private http: HttpClient) {}

  getUtente(id: string){
    return this.http.get<utenteDTO>(`${this.API_URL}/${id}`, {
      withCredentials: true
    });
  }

  getUtenteAll() {
    return this.http.get<utenteDTO[]>(`${this.API_URL}/admin/all`, {withCredentials: true});
  }

  approvaMedico(idMedico: number) {
    return this.http.put<boolean>(`${this.API_URL}/admin/approva-medico/${idMedico}`, {} ,{withCredentials: true});
  }

  rifiutaMedico(idMedico: number) {
    return this.http.put<boolean>(`${this.API_URL}/admin/rifiuta-medico/${idMedico}`, {}, {withCredentials: true});
  }

  getImpostazioni(id: number) {
    return this.http.get<ImpostazioniNotifiche>(`${this.API_URL}/impostazioni/notifiche/${id}`, {withCredentials: true});
  }

  aggiornaImpostazioni(idUtente: number) {
    return this.http.put<boolean>(`${this.API_URL}/impostazioni/aggiorna/${idUtente}`, {}, {withCredentials: true});
  }
}
