import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessaggioDTO {
  id?: number;
  mittente_id: number;
  destinatario_id: number;
  testo: string;
  data_invio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8080/api/chat';

  constructor(private http: HttpClient) { }

  // 1. Scarica la chat singola tra due persone
  getStoria(idMio: number, idAltro: number): Observable<ChatMessaggioDTO[]> {
    return this.http.get<ChatMessaggioDTO[]>(`${this.apiUrl}/storia/${idMio}/${idAltro}`);
  }

  // 2. Invia messaggio
  inviaMessaggio(msg: ChatMessaggioDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/invia`, msg, { responseType: 'text' });
  }

  // 👇 3. NUOVO METODO CHE MANCAVA (Risolve errore TS2339)
  getContatti(idMio: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/contatti/${idMio}`);
  }
}
