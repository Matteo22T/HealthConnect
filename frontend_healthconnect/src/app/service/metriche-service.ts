import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetricheSaluteDTO, TipoMetrica, MetricheRaggruppate } from '../model/metricheSaluteDTO';

@Injectable({
  providedIn: 'root'
})
export class MetricheService {
  private API_URL = 'http://localhost:8080/api/metriche-salute';

  constructor(private http: HttpClient) {}

  getMetrichePaziente(pazienteId: number): Observable<MetricheSaluteDTO[]> {
    return this.http.get<MetricheSaluteDTO[]>(`${this.API_URL}/paziente/${pazienteId}`, {
      withCredentials: true
    });
  }

  getMetricheUltimi6Mesi(pazienteId: number): Observable<MetricheSaluteDTO[]> {
    return this.http.get<MetricheSaluteDTO[]>(`${this.API_URL}/paziente/${pazienteId}/ultimi-6-mesi`, {
      withCredentials: true
    });
  }

  raggruppaMetrichePerTipo(metriche: MetricheSaluteDTO[]): MetricheRaggruppate {
    const raggruppate: MetricheRaggruppate = {
      [TipoMetrica.PESO]: [],
      [TipoMetrica.PRESSIONE_MAX]: [],
      [TipoMetrica.PRESSIONE_MIN]: [],
      [TipoMetrica.GLICEMIA]: []
    };

    metriche.forEach(metrica => {
      if (raggruppate[metrica.tipoMetrica]) {
        raggruppate[metrica.tipoMetrica].push(metrica);
      }
    });

    // Ordina per data
    Object.keys(raggruppate).forEach(tipo => {
      raggruppate[tipo as TipoMetrica].sort((a, b) =>
        new Date(a.data).getTime() - new Date(b.data).getTime()
      );
    });

    return raggruppate;
  }
}
