import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
  ) { }


  login(username: string, password: string): Observable<any> {
    const body = {
      username,
      password,
    };

    return this.http.post(`${API_URL}/login`, body, { withCredentials: true });
  }

  checkAuth(): Observable<any> {
    return this.http.get(`${API_URL}/check-auth`, { withCredentials: true });
  }
}
