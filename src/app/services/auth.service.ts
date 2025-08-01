import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'log_token';

  constructor(
    private http: HttpClient,
  ) { }


  login(username: string, password: string): Observable<any> {
    const body = {
      username,
      password,
    };

    return this.http.post(`${API_URL}/login`, body);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string {
    return localStorage.getItem(this.tokenKey);
  }
}
