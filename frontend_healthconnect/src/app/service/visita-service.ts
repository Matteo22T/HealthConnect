import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {prenotazioneDTO} from '../model/prenotazioneDTO';
import {VisitaDTO} from '../model/visitaDTO';

@Injectable({
  providedIn: 'root',
})
export class VisitaService {
  private API_URL = "http://localhost:8080/api/visite";

  constructor(private http : HttpClient) {
  }

  getVisiteOdierneByMedico(id: number){
    return this.http.get<VisitaDTO[]>(`${this.API_URL}/oggi/medici/${id}`,{
      withCredentials: true
    });
  }

}
