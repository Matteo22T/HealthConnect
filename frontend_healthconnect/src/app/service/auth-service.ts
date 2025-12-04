import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, Observable, of, tap, throwError} from 'rxjs';
import {utenteDTO} from '../model/utenteDTO';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private API_URL = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<utenteDTO | null>{
    const body = new HttpParams()
      .set('username', email) // Mappiamo la tua email sul campo 'username' di Spring
      .set('password', password);
    return this.http.post<utenteDTO>(`${this.API_URL}/login`, body, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).pipe(
      tap(user => {
        console.log('Login effettuato, utente:', user);
        // Qui potresti salvare l'utente in una variabile locale dello stato (Subject/Signal)
      }),
      catchError(error => {
        if (error.status === 401) {
          console.error('Credenziali errate');
          // Restituisci null se il login fallisce, così il componente lo sa
          return of(null);
        }
        // Per altri errori (es. server down 500), rilancia l'errore
        return throwError(() => error);
      })
    );
  }

  register(utente: utenteDTO){
    return this.http.post<utenteDTO>(`${this.API_URL}/register`, utente);
  }

  checkAuth(): Observable<utenteDTO> {
    return this.http.get<utenteDTO>(`${this.API_URL}/check`, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true });
  }

}
