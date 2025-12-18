import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DiagnosisRequest, DiagnosisResponse} from '../model/tipi-sintomiDTO';

export interface AiMessage {
  sender: 'USER' | 'BOT';
  text: string;
  actionUrl?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private API_URL = 'http://localhost:8080/api/ai';

  private API_URL_DIAGNOSIS = 'http://localhost:8080/api/infermedica';


  constructor(private http: HttpClient) {}

  sendMessage(text: string): Observable<{ risposta: string, azioneSuggerita: string }> {
    return this.http.post<{ risposta: string, azioneSuggerita: string }>(
      `${this.API_URL}/supporto`,
      { testoUtente: text },
      { withCredentials: true }
    );
  }


  initDiagnosis(text: string, age: number, sex: string): Observable<DiagnosisResponse> {
    const body = { text, age, sex };
    return this.http.post<DiagnosisResponse>(`${this.API_URL_DIAGNOSIS}/diagnosis`, body);
  }

  updateDiagnosis(request: DiagnosisRequest): Observable<DiagnosisResponse> {
    return this.http.post<DiagnosisResponse>(`${this.API_URL_DIAGNOSIS}/diagnosis/update`, request);
  }
}
