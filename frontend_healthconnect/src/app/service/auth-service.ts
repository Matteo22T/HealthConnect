import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, of, tap, throwError} from 'rxjs';
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
        let messaggioErrore = 'Errore di connessione o server non raggiungibile.';

        if (error.status === 401 || error.status === 403) {

          //error.error è il body della risposta quindi error.error.error è il campo "error" dentro il JSON.
          if (error.error && error.error.error) {
            messaggioErrore = error.error.error;
          } else {
            messaggioErrore = 'Email o Password errati.';
          }
        }

        console.error('Login fallito:', messaggioErrore);

        // Rilanciamo l'errore al componente con il testo preciso
        return throwError(() => new Error(messaggioErrore));
      })
    );
  }

  register(utente: utenteDTO){
    return this.http.post<utenteDTO>(`${this.API_URL}/register`, utente);
  }

  checkAuth(): Observable<boolean> {
    return this.http.get<utenteDTO>(`${this.API_URL}/check`, { withCredentials: true }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      map(() => true),
      catchError(() => {
        this.logoutLocal();
        return of(false);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        // Rimuoviamo tutto al logout
        this.logoutLocal();
      })
    );
  }

  private logoutLocal() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
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
