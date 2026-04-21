import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL, IMAGE_URL } from './api.service';

export interface Category {
  id: string,
  name: string,
  description: string,
  image: string,
  imageUrl: string,
  imageAboutUrl: string,
  content: string,
  products: Product[],
  stats: string,
}

export interface Product {
  id: string;
  name: string;
  subname: string;
  description: string;
  imageUrl: string;
  pathogens?: string[];
  technology?: string[];
  content?: any[];
  card?: string;
  disabled?: boolean;
  isRuo?: boolean;
  isCe?: boolean;
  isComingSoon?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private selectedCategory = new BehaviorSubject<Category | null>(null);

  selectedCategory$ = this.selectedCategory.asObservable();

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
        return products.filter((product) => product.pathogens?.includes(illness))
      })
    )
  }

  getProductsByPathogens(pathogens: string[]): Observable<any> {
    return this.getProducts().pipe(
      map((products: any[]) => {
        return products.filter((product) => pathogens.some((value) => product.pathogens?.includes(value)))
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
      map((categories: any) => categories.map((category: any) => ({
        ...category,
        imageUrl: `${IMAGE_URL}/${category.image}`,
        imageAboutUrl: `${IMAGE_URL}/${category.image_about}`,
        products: JSON.parse(category.products ?? '[]').map(this.mapProduct),
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

  setCategory(category: Category) {
    this.selectedCategory.next(category);
  }

  getCategoryById(id: string): Observable<Category> {
    const headers = new HttpHeaders({
      'X-App-Lang': this.translate.currentLang,
    });

    return this.http.get<any[]>(`${API_URL}/products/category/${id}`, { headers }).pipe(
      map((categories: any[]) => {
        const category = categories[0];

        return {
          ...category,
          imageUrl: `${IMAGE_URL}/${category.image}`,
          imageAboutUrl: `${IMAGE_URL}/${category.image_about}`,
          products: JSON.parse(category.products ?? []).map(this.mapProduct),
        };
      })
    );
  }

  private mapProduct(raw: any): Product {
    return {
      id: raw.product_id,
      name: raw.product_name,
      subname: raw.product_subname,
      description: raw.product_description,
      imageUrl: `${IMAGE_URL}/${raw.product_image}`,
      content: undefined,
    }
  }
}
