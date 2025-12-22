import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {utenteDTO} from '../model/utenteDTO';
import {Observable} from 'rxjs';

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

  getUtenteAll() {
    return this.http.get<utenteDTO[]>(`${this.API_URL}/admin/all`, {withCredentials: true});
  }

  approvaMedico(idMedico: number) {
    return this.http.put<boolean>(`${this.API_URL}/admin/approva-medico/${idMedico}`, {} ,{withCredentials: true});
  }

  rifiutaMedico(idMedico: number) {
    return this.http.put<boolean>(`${this.API_URL}/admin/rifiuta-medico/${idMedico}`, {}, {withCredentials: true});
  }
}
