import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  sendMessage(text: string): Observable<{ risposta: string, azioneSuggerita: string }> {
    return this.http.post<{ risposta: string, azioneSuggerita: string }>(
      `${this.API_URL}/supporto`,
      { testoUtente: text },
      { withCredentials: true }
    );
  }
}
