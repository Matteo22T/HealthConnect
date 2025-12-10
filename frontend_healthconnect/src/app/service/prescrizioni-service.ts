import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {prescrizioneDTO} from '../model/prescrizioneDTO';

@Injectable({
  providedIn: 'root',
})
export class PrescrizioniService {
  private API_URL= "http://localhost:8080/api/prescrizioni"

  constructor(private http: HttpClient) {}


  getPrescrizioni(id: number){
    return this.http.get<prescrizioneDTO[]>(`${this.API_URL}/paziente/${id}`, {
      withCredentials: true
    });
  }
}
