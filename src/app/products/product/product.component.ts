import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ParallaxDirective } from '../../directives/parallax.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ArianeComponent, Path } from '../../ariane/ariane.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxOpen, faUpRightFromSquare, faDna } from '@fortawesome/free-solid-svg-icons';
import { AppService } from '../../services/app.service';

export interface Product {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  pathogens: string[]
  technology: string[]
  content: any[]
  card?: string
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    ParallaxDirective,
    TranslateModule,
    ArianeComponent,
    RouterModule,
    FontAwesomeModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  product: Product;

  navigationPath: Path[];

  previousPath: Path | undefined;

  faUpRightFromSquare = faUpRightFromSquare;

  faBoxOpen = faBoxOpen;

  faDna = faDna;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private appService: AppService,
  ) {}

  ngOnInit(): void {
    this.appService.initScrollReveal();

    this.loadProduct();

    this.previousPath = history.state?.previousPath;
    console.log(this.previousPath);
    this.translate.onLangChange.subscribe(() => {
      this.loadProduct();
    })
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    this.productService.findProduct(productId).subscribe((product) => {
      this.product = product;

      this.setNavigationPath();
    });
  }

  setNavigationPath(): void {
    if (this.previousPath) {
      this.navigationPath = [
        { name: 'header.product', link: '/products' },
        { name: this.previousPath.name, link: this.previousPath.link },
        { name: this.product.title, link: this.product.id },
      ];
    } else {
      this.navigationPath = [
        { name: 'header.product', link: '/products' },
        { name: this.product.title, link: this.product.id },
      ];
    }
  }

  goBack(): void {
    if (this.previousPath) {
      this.router.navigate([this.previousPath.link]);
    } else {
      this.router.navigate(['/products']);
    }
  }
}
