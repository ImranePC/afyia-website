import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_URL = environment.apiUrl;

  private DISOFT_URL = 'https://disoft-ruo.di4diag.com/api/v1';

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
  ) { }

  sendMessage(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/send-message`, data);
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

    return this.http.post(`${this.DISOFT_URL}/create-user-request`, body, { headers });
  }

  getAvailableThermocycler(): Observable<any> {
    return this.http.get(`${this.DISOFT_URL}/available-thermocycler`);
  }
}
