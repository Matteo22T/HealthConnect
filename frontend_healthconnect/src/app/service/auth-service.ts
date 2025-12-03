import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {utenteDTO} from '../model/utenteDTO';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private API_URL = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<utenteDTO>{
    const body = {
      email,password
    };
    return this.http.post<utenteDTO>(`${this.API_URL}/login`, body)
  }

}
