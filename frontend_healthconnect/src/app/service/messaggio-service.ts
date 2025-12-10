import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessaggioDTO} from '../model/messaggioDTO';

@Injectable({
  providedIn: 'root',
})
export class MessaggioService {
  private API_URL = "http://localhost:8080/api/messaggi";

  constructor(private http: HttpClient) {}

  getMessaggiNonLetti(id: number){
    return this.http.get<MessaggioDTO[]>(`${this.API_URL}/nonletti/utenti/${id}`, {
      withCredentials: true
    });
  }

}
