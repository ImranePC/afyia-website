import { Component, OnInit } from '@angular/core';
import { ParallaxDirective } from '../directives/parallax.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ArianeComponent } from '../ariane/ariane.component';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { RouterModule } from '@angular/router';
import { AppService } from '../services/app.service';

export const PATHOGENS = [
  { label: 'Monkeypox virus', value: 'mpox' },
  { label: 'SARS-CoV-2', value: 'sars-cov' },
  { label: 'Varicella-Zona', value: 'varicella' },
  { label: 'Herpes simplex virus type 1/2', value: 'herpes' },
  { label: 'Hepatitis B virus', value: 'hepatitis' },
];

export const TECHNOLOGIES = [
  { label: 'Real-time PCR', value: 'rt-pcr' },
  { label: 'HRM-PCR', value: 'hrm-pcr' },
  { label: 'Quantitative real-time PCR', value: 'qrt-pcr' },
]

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    ParallaxDirective,
    TranslateModule,
    ArianeComponent,
    FontAwesomeModule,
    FormsModule,
    ProductCardComponent,
    RouterModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: any;

  faBoxOpen = faBoxOpen;

  pathogenList = PATHOGENS;

  technologyList = TECHNOLOGIES;

  selectedFilter: any = {
    pathogen: null,
    technology: null,
  }

  constructor(
    private productService: ProductService,
    private translate: TranslateService,
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();

    this.translate.onLangChange.subscribe(() => {
      this.loadProducts();
    })

    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    })
  }

  resetFilter(): void {
    this.selectedFilter.pathogen = null;
    this.selectedFilter.technology = null;
  }

  get hasFilter(): boolean {
    return Object.values(this.selectedFilter).some((value) => value !== null);
  }

  get filteredProducts(): any {
    if (!this.hasFilter) {
      return this.products;
    }

    return this.products.filter((product: any) =>
      (this.selectedFilter.technology ? product.technology.includes(this.selectedFilter.technology) : true)
      && (this.selectedFilter.pathogen ? product.pathogens.includes(this.selectedFilter.pathogen) : true)
    );
  }
}
