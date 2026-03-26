import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL, IMAGE_URL } from './api.service';

export interface Category {
  id: string,
  name: string,
  image: string,
  imageUrl: string,
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private translate: TranslateService,
  ) { }

  getProducts(pathogen?: any, technology?: any): Observable<any> {
    const headers = new HttpHeaders({
      'X-App-Lang': this.translate.currentLang,
    });

    let params = new HttpParams();

    if (pathogen?.id) {
      params = params.set('pathogen', pathogen.id);
    }

    if (technology?.id) {
      params = params.set('technology', technology.id);
    }

    return this.http.get<any[]>(`${API_URL}/products`, { headers, params }).pipe(
      map((products) => products.map((product) => ({
        ...product,
        imageUrl: `${IMAGE_URL}/${product.product_image}`,
      })))
    );
  }

  getFeaturedProducts(): Observable<any> {
    const headers = new HttpHeaders({
      'X-App-Lang': this.translate.currentLang,
    });

    return this.http.get<any[]>(`${API_URL}/products/featured`, { headers }).pipe(
      map((products) => products.map((product) => ({
        ...product,
        imageUrl: `${IMAGE_URL}/${product.product_image}`,
      })))
    );
  }

  getAssociatedProducts(illness: string): Observable<any> {
    return this.getProducts().pipe(
      map((products: any[]) => {
        return products.filter((product) => product.pathogens.includes(illness))
      })
    )
  }

  getProductsByPathogens(pathogens: string[]): Observable<any> {
    return this.getProducts().pipe(
      map((products: any[]) => {
        return products.filter((product) => pathogens.some((value) => product.pathogens.includes(value)))
      })
    )
  }

  findProduct(productId: string): Observable<any> {
    return this.getProducts().pipe(
      map((products: any[]) => {
        return products.find((product) => product.id === productId);
      })
    );
  }

  getProductsCategories(): Observable<any> {
    const headers = new HttpHeaders({
      'X-App-Lang': this.translate.currentLang,
    });

    return this.http.get<any[]>(`${API_URL}/categories`, { headers }).pipe(
      map((categories) => categories.map((category) => ({
        ...category,
        imageUrl: `${IMAGE_URL}/${category.image}`,
      })))
    );
  }

  getTechnologies(): Observable<any> {
    const headers = new HttpHeaders({
      'X-App-Lang': this.translate.currentLang,
    });

    return this.http.get<any[]>(`${API_URL}/technologies`, { headers });
  }

  getPathogens(): Observable<any> {
    const headers = new HttpHeaders({
      'X-App-Lang': this.translate.currentLang,
    });

    return this.http.get<any[]>(`${API_URL}/pathogens`, { headers });
  }
}
