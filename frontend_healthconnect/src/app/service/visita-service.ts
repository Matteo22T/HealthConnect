import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {VisitaDTO} from '../model/visitaDTO';
import {Observable, Subject} from 'rxjs';
import {utenteDTO} from '../model/utenteDTO';
import {VisitaDettaglioDTO} from '../model/visitaDettaglioDTO';

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

  getVisiteByMedico(id: number){
    return this.http.get<VisitaDTO[]>(`${this.API_URL}/tutti/medici/${id}`,{
      withCredentials: true
    });
  }

  getVisiteSenzaDiagnosi(idMedico: number): Observable<VisitaDTO[]> {
    return this.http.get<VisitaDTO[]>(`${this.API_URL}/visite_no_diagnosi/medico/${idMedico}`, {withCredentials: true});
  }

  getListaPazientiMedico(id: number): Observable<utenteDTO[]>{
    return this.http.get<utenteDTO[]>(`${this.API_URL}/pazienti/medici/${id}`, {
      withCredentials: true
    });
  }

  getNumeroPazientiMedico(id: number): Observable<number>{
    return this.http.get<number>(`${this.API_URL}/num_pazienti/medici/${id}`, {
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

  getVisitePazientePassateByMedico(pazienteId: string, id: number) {
    return this.http.get<VisitaDettaglioDTO[]>(`${this.API_URL}/paziente/${pazienteId}/medico/${id}`, {
      withCredentials: true
    });
  }

  getVisitaById(visitaId: string) {
    return this.http.get<VisitaDettaglioDTO>(`${this.API_URL}/medico/${visitaId}`, {
      withCredentials: true
    })
  }

  salvaVisita(visita: VisitaDettaglioDTO){
    return this.http.put<boolean>(`${this.API_URL}/medico/salva/${visita.id}`, visita, {withCredentials: true});
  }
  getStoricoVisite(pazienteId: number): Observable<VisitaDTO[]> {
    return this.http.get<VisitaDTO[]>(`${this.API_URL}/storico/pazienti/${pazienteId}`, {
      withCredentials: true
    });
  }

  getNumeroVisiteOdierne(){
    return this.http.get<number>(`${this.API_URL}/admin/numero_visite_oggi`, {withCredentials: true}); }

}
