import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessaggioDTO} from '../model/messaggioDTO';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessaggioService {

  private _refreshNeeded$ = new Subject<void>();

  get refreshNeeded$() {
    return this._refreshNeeded$.asObservable();
  }

  //Metodo per suonare il campanello
  triggerRefresh() {
    this._refreshNeeded$.next();
  }

  private API_URL = "http://localhost:8080/api/messaggi";

  constructor(private http: HttpClient) {}

  getMessaggiNonLetti(id: number){
    return this.http.get<MessaggioDTO[]>(`${this.API_URL}/nonletti/utenti/${id}`, {
      withCredentials: true
    });
  }

}
