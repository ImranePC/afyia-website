import { Component, computed, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ArianeComponent } from '../../components/ariane/ariane.component';
import { faBoxOpen, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { Category, ProductService } from '../../services/product.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { Router, RouterModule } from '@angular/router';
import { AppService } from '../../services/app.service';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { BannerComponent } from '../../components/banner/banner.component';

export const PATHOGENS = [
  { label: 'Monkeypox virus', value: 'mpox' },
  { label: 'SARS-CoV-2', value: 'sars-cov' },
  { label: 'Varicella-Zona', value: 'varicella' },
  { label: 'Herpes simplex virus type 1/2', value: 'herpes' },
  { label: 'Hepatitis B virus', value: 'hepatitis' },
];

export const TECHNOLOGIES = [
  { label: 'HRM-PCR', value: 'hrm-pcr' },
  { label: 'MPM-PCR', value: 'mpm-pcr' },
  { label: 'Quantitative Real-Time PCR', value: 'realtime-pcr' },
  { label: 'Immunochromatography', value: 'immuno' },
]

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    TranslateModule,
    ArianeComponent,
    FontAwesomeModule,
    FormsModule,
    ProductCardComponent,
    RouterModule,
    CommonModule,
    ClickOutsideDirective,
    BannerComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: any;

  faBoxOpen = faBoxOpen;

  faCaretDown = faCaretDown;

  selectedFilter: any = {
    pathogen: null,
    technology: null,
  }

  categories: any = [];

  pathogens: any = [];

  technologies: any = [];

  isCategoriesLoading = true;

  constructor(
    private productService: ProductService,
    private translate: TranslateService,
    private appService: AppService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();

    this.translate.onLangChange.subscribe(() => {
      this.loadProducts();
      this.loadData();
    })

    this.loadProducts();
    this.loadData();
  }

  loadProducts(): void {
    this.productService.getProducts(
      this.selectedFilter.pathogen,
      this.selectedFilter.technology,
    ).subscribe((data) => {
      this.products = data;
    })
  }

  loadData(): void {
    // Categories
    this.productService.getProductsCategories().subscribe((data) => {
      this.categories = data;
      this.isCategoriesLoading = false;
    });

    // Pathogens
    this.productService.getPathogens().subscribe((data) => {
      this.pathogens = data;
    });

    // Technologies
    this.productService.getTechnologies().subscribe((data) => {
      this.technologies = data;
    });
  }

  resetFilter(): void {
    this.selectedFilter.pathogen = null;
    this.selectedFilter.technology = null;
    this.loadProducts()
  }

  selectPathogen(pathogen: any): void {
    this.selectedFilter.pathogen = pathogen;
    this.loadProducts();
  }

  selectTechnology(technology: any): void {
    this.selectedFilter.technology = technology;
    this.loadProducts();
  }

  openDropdown(dropdown: HTMLElement, event: any): void {
    event.stopPropagation();
    dropdown.style.display = 'block';
  }

  closeDropdown(dropdown: HTMLElement, event: any): void {
    event.stopPropagation();
    dropdown.style.display = 'none';
  }

  openCategoryPage(category: Category): void {
    this.productService.setCategory(category);
    this.router.navigate(['/products/', category.id]);
  }

  get hasFilter(): boolean {
    return Object.values(this.selectedFilter).some((value) => value !== null);
  }
}
