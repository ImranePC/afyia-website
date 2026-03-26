import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth.service';

export const API_URL = environment.apiUrl;

export const IMAGE_URL = environment.imageUrl;

export const DISOFT_URL = 'https://disoft-ruo.di4diag.com/api/v1';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private authService: AuthService
  ) { }

  sendMessage(data: any): Observable<any> {
    return this.http.post(`${API_URL}/send-message`, data);
  }

  sendSoftwareRequest(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'X-App-Lang': this.translate.currentLang,
    });

    const body = {
      email: data.email,
      user_type: 'humain',
      thermocyclers: data.thermocyclers,
      accounts: data.accounts,
    }

    return this.http.post(`${DISOFT_URL}/create-user-request`, body, { headers });
  }

  getAvailableThermocycler(): Observable<any> {
    return this.http.get(`${DISOFT_URL}/available-thermocycler`);
  }

  uploadImage(data: any): Observable<any> {
    return this.http.post(`${API_URL}/admin/upload-image`, data);
  }

  getImagesList(): Observable<any> {
    return this.http.get(`${API_URL}/admin/list-images`, { withCredentials: true });
  }

  subscribeToNewsletter(email: string): Observable<any> {
    const body = {
      email,
    }

    return this.http.post(`${API_URL}/newsletter/save`, body);
  }
}
