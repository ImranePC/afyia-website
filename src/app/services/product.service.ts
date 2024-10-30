import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private translate: TranslateService) {}

  getProducts(): Observable<any> {
    const language = this.translate.currentLang;

    return this.http.get(`assets/data/products_${language}.json`);
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
}
