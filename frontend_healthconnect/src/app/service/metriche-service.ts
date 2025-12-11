import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetricheSaluteDTO } from '../model/metricheSaluteDTO';

@Injectable({
  providedIn: 'root'
})
export class MetricheService {
  private API_URL = 'http://localhost:8080/api/metriche-salute';

  constructor(private http: HttpClient) {}

  getMetricheUltimi6Mesi(pazienteId: number): Observable<MetricheSaluteDTO[]> {
    return this.http.get<MetricheSaluteDTO[]>(`${this.API_URL}/paziente/${pazienteId}/ultimi-6-mesi`, {
      withCredentials: true
    });
  }
}
