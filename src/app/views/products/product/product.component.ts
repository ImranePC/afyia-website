import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ArianeComponent, Path } from '../../../components/ariane/ariane.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoxOpen, faUpRightFromSquare, faDna, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { AppService } from '../../../services/app.service';
import { ModalComponent } from '../../../components/modal/modal.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SoftwareLinkCardComponent } from '../../../components/software-link-card/software-link-card.component';
import { BannerComponent } from '../../../components/banner/banner.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    TranslateModule,
    ArianeComponent,
    RouterModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SoftwareLinkCardComponent,
    BannerComponent,
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

  faPaperPlane = faPaperPlane;

  contactForm: FormGroup;

  isClient = false;

  isLoading = true;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private appService: AppService,
    private fb: FormBuilder,
  ) {
    this.contactForm = this.fb.group({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      subject: [undefined, Validators.required],
    })
  }

  ngOnInit(): void {
    this.appService.initScrollReveal();

    this.loadProduct();

    this.previousPath = history.state?.previousPath;

    this.translate.onLangChange.subscribe(() => {
      this.loadProduct();
    })
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    this.productService.getProductById(productId).subscribe((product) => {
      this.product = product;

      this.isLoading = false;
      this.setNavigationPath();
    });
  }

  setNavigationPath(): void {
    if (this.previousPath) {
      this.navigationPath = [
        { name: 'header.product', link: '/products' },
        { name: this.previousPath.name, link: this.previousPath.link },
        { name: this.product.name, link: this.product.id },
      ];
    } else {
      this.navigationPath = [
        { name: 'header.product', link: '/products' },
        { name: this.product.name, link: this.product.id },
      ];
    }
  }

  isFieldInvalid(test: string): boolean {
    return false;
  }

  goBack(): void {
    if (this.previousPath) {
      this.router.navigate(this.appService.path(this.previousPath.link));
    } else {
      this.router.navigate(this.appService.path('products'));
    }
  }
}
