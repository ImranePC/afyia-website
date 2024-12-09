import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { SafeHtml } from '@angular/platform-browser';

export interface News {
  id: string
  title: string
  content: string | SafeHtml
  imageUrl: string
  publishedAt: Date
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private translate: TranslateService) {}

  getNews(): Observable<any> {
    const language = this.translate.currentLang;

    return this.http.get(`${this.API_URL}/news`)
      .pipe(map((data: any) =>
        data.map((news: any) => this.formatResponse(news, true)),
      ));
  }

  getNewsById(id: string): Observable<any> {
    const language = this.translate.currentLang;

    const headers = new HttpHeaders({
      'X-App-Lang': language,
    });

    return this.http.get(`${this.API_URL}/news/${id}`, { headers })
      .pipe(map((data: any) => this.formatResponse(data)));
  }

  private formatResponse(data: any, shortenContent = false): News {
    return {
      id: data.id,
      title: data.title,
      content: shortenContent ? this.removeTags(data.content) : data.content,
      imageUrl: data.image_url,
      publishedAt: data.published_at
    };
  }

  private removeTags(content: string): string {
    const regex = new RegExp('\\{.*?\\}|<.*?>', 'g');
    return content.replace(regex, '');
  }
}
