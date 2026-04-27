import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL, IMAGE_URL } from './api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  fullDescription: SafeHtml;
  mainImageUrl: string;
  descriptionImageUrl: string;
  showSoftwareLink: boolean;
  pathogens?: string[];
  technology?: string[];
  content?: SafeHtml;
  card?: string;
  disabled?: boolean;
  isRuo?: boolean;
  isCe?: boolean;
  isComingSoon?: boolean;
  featuresTable?: SafeHtml,
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
    private sanitizer: DomSanitizer,
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
      map((products) => products.map((product: any) => this.mapProduct(product))
    ));
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

  getProductById(productId: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-App-Lang': this.translate.currentLang,
    });

    return this.http.get<any[]>(`${API_URL}/product/${productId}`, { headers }).pipe(
      map((products: any[]) => {
        const product = products[0];

        return this.mapProduct(product);
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
        products: JSON.parse(category.products ?? '[]').map((p: any) => this.mapProduct(p)),
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
          products: JSON.parse(category.products ?? []).map((p: any) => this.mapProduct(p)),
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
      fullDescription: this.sanitizer.bypassSecurityTrustHtml(raw.product_full_description),
      mainImageUrl: `${IMAGE_URL}/${raw.product_image}`,
      descriptionImageUrl: `${IMAGE_URL}/${raw.description_image}`,
      content: this.sanitizer.bypassSecurityTrustHtml(raw.product_content),
      isRuo: raw.is_ruo,
      isCe: raw.is_ce,
      isComingSoon: raw.is_coming_soon,
      showSoftwareLink: raw.show_software_link,
      featuresTable: this.sanitizer.bypassSecurityTrustHtml(raw.features_table),
    }
  }
}
