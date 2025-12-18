import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, of, tap, throwError} from 'rxjs';
import {utenteDTO} from '../model/utenteDTO';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private API_URL = "http://localhost:8080/api/auth";

  private currentUserSubject = new BehaviorSubject<utenteDTO | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (e) {
        console.error('Errore nel parsing utente', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  public get currentUserValue(): utenteDTO | null {
    return this.currentUserSubject.value;
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
        localStorage.setItem('currentUser', JSON.stringify(user));

        // 2. Aggiorniamo lo stato dell'app
        this.currentUserSubject.next(user);
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
    return this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        // Rimuoviamo tutto al logout
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      })
    );
  }

  modificaEmailETelefono(utente : utenteDTO): Observable<utenteDTO> {
    return this.http.put<utenteDTO>(`${this.API_URL}/modifica/emailtelefono`, utente, {withCredentials: true}).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      })
    );
  }

  modificaIndirizzoEBiografia(utente: utenteDTO){
    return this.http.put<utenteDTO>(`${this.API_URL}/modifica/indirizzobiografia`, utente, {withCredentials: true}).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      })
    );
  }

  cambiaPassword(id: number,attuale: string, nuova: string){
    const body = {id, attuale, nuova};
    return this.http.put(`${this.API_URL}/cambiapassword`, body, {withCredentials: true, responseType: "text"}).pipe()
  }

}
