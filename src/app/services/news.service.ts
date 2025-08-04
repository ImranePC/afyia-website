import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export class News {
  private imagePath = environment.apiUrl + '/uploads/images/'

  constructor(
    public id: string,
    public title: {
      [lang: string]: string | SafeHtml
    },
    public content: {
      [lang: string]: string | SafeHtml
    },
    public imageUrl: string,
    public bannerUrl: string,
    public publishedAt: string,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.imageUrl = imageUrl;
    this.bannerUrl = bannerUrl;
    this.publishedAt = publishedAt;
  }

  get fullImageUrl(): string {
    return this.imagePath + this.imageUrl;
  }

  get fullBannerUrl(): string {
    return this.imagePath + this.bannerUrl;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private API_URL = environment.apiUrl;

  public IMAGE_URL = environment.apiUrl + '/uploads/images/'

  private LANGUAGES = ['fr', 'en'];

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
  ) {}

  getNews(): Observable<any> {
    const headers = new HttpHeaders({
      'X-App-Lang': this.translate.currentLang,
    });

    return this.http.get(`${this.API_URL}/news`, { headers })
      .pipe(map((data: any) =>
        data.map((news: any) => this.formatResponse(news, true)),
      ));
  }

  getNewsById(id: string, getAllTranslations = false): Observable<any> {
    const headers = new HttpHeaders({
      'X-App-Lang': getAllTranslations ? 'all' : this.translate.currentLang,
    });

    return this.http.get(`${this.API_URL}/news/${id}`, { headers })
      .pipe(map((data: any) => this.formatResponse(data)));
  }

  updateNews(data: any): Observable<any> {
    const body = {
      id: data.id,
      title: data.title,
      content: data.content,
      image_url: data.imageUrl,
      banner_url: data.bannerUrl,
      published_at: data.publishedAt,
    }

    return this.http.put(`${this.API_URL}/admin/news`, body, { withCredentials: true });
  }

  createNews(data: any): Observable<any> {
    const headers = {
      Authorization: 'Bearer admin123',
    }

    const body = {
      id: data.id,
      title: data.title,
      content: data.content,
      image_url: data.imageUrl,
      banner_url: data.bannerUrl,
      published_at: data.publishedAt,
    }

    return this.http.post(`${this.API_URL}/admin/news`, body, { headers, withCredentials: true });
  }

  deleteNews(newsId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/admin/news/${newsId}`, { withCredentials: true });
  }

  private formatResponse(data: any, shortenContent = false): News {
    const title: any = {};
    const content: any = {};

    this.LANGUAGES.forEach((language: string) => {
      const contentData = data['content_' + language];
      if (contentData) {
        content[language] = shortenContent ? this.removeTags(contentData) : contentData;
      }

      const titleData = data['title_' + language];
      if (titleData) {
        title[language] = titleData;
      }
    })

    return new News(
      data.id,
      title,
      content,
      data.image_url,
      data.banner_url,
      data.published_at,
    );
  }

  private removeTags(content: string): string {
    const regex = new RegExp('\\{.*?\\}|<.*?>', 'g');
    return content.replace(regex, '');
  }

  public formatContent(content: string): SafeHtml {
    const regex = new RegExp('{\\s*img:(.*?)\\s*}', 'g');
    const imageUrl = this.IMAGE_URL;

    return this.sanitizer.bypassSecurityTrustHtml(
      content.replace(regex, (match: any, image: string) => {
        return `<img class='mx-auto rounded-xl my-5' src="${imageUrl}${image}" title="" alt="">`;
      })
    );
  }
}
