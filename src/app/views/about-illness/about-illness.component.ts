import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ArianeComponent, Path } from '../../components/ariane/ariane.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Category, Product, ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { AppService } from '../../services/app.service';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../components/banner/banner.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-about-illness',
  standalone: true,
  imports: [
    ArianeComponent,
    TranslateModule,
    RouterModule,
    ProductCardComponent,
    CommonModule,
    BannerComponent,
  ],
  templateUrl: './about-illness.component.html',
  styleUrl: './about-illness.component.scss',
})
export class AboutIllnessComponent implements OnInit {
  @Input()
  pathogens: string[];

  @Input()
  path: Path = { name: 'Undefined', link: '/'};

  @Input()
  title: string;

  @Input()
  bannerImage: string;

  isLoading = true;

  // @ViewChild('banner')
  // set banner(component: BannerComponent) {
  //   if (component) {
  //     component.reduceSize();
  //   }
  // }

  navigationPath: Path[] = [
    { name: 'header.product', link: '/products' },
  ]

  products: Product[];

  category: Category;

  constructor(
    private translate: TranslateService,
    private productService: ProductService,
    private appService: AppService,
    private route : ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.appService.setDark(false);
    this.appService.initScrollReveal();

    this.translate.onLangChange.subscribe(() => {
      //
    })

    this.productService.selectedCategory$.subscribe(async (category: Category) => {
      if (category) {
        this.category = category;
        this.isLoading = false;
        this.path = { name: this.category.name, link: `/products/${this.category.id}`};
        this.navigationPath.push(this.path);
      } else {
        const id = this.route.snapshot.paramMap.get('id');
        this.category = await firstValueFrom(this.productService.getCategoryById(id));
        this.isLoading = false;
        this.navigationPath.push({ name: this.category.name, link: `/products/${this.category.id}`});
      }
    });
  }
}
