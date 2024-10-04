import { Component, Input, OnInit } from '@angular/core';
import { ArianeComponent, Path } from '../ariane/ariane.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../products/product/product.component';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-about-illness',
  standalone: true,
  imports: [ArianeComponent, TranslateModule, RouterModule, ProductCardComponent],
  templateUrl: './about-illness.component.html',
  styleUrl: './about-illness.component.scss'
})
export class AboutIllnessComponent implements OnInit {
  @Input()
  illnessId: string;

  @Input()
  path: Path = { name: 'Undefined', link: '/'};

  navigationPath: Path[] = [
    { name: 'header.product', link: '/products' },
  ]

  products: Product[];

  constructor(
    private translate: TranslateService,
    private productService: ProductService,
    private appService: AppService,
  ) {}

  ngOnInit(): void {
    this.appService.initScrollReveal();

    this.navigationPath.push(this.path);
    this.loadAssociatedProducts();

    this.translate.onLangChange.subscribe(() => {
      this.loadAssociatedProducts();
    })
  }

  loadAssociatedProducts(): void {
    this.productService.getAssociatedProducts(this.illnessId).subscribe((data) => {
      this.products = data;
    })
  }
}
