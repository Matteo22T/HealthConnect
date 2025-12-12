import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {utenteDTO} from '../model/utenteDTO';

@Injectable({
  providedIn: 'root',
})
export class UtenteService {

  API_URL = "http://localhost:8080/api/utenti";

  constructor(private http: HttpClient) {}

  getUtente(id: string){
    return this.http.get<utenteDTO>(`${this.API_URL}/${id}`, {
      withCredentials: true
    });
  }
}
