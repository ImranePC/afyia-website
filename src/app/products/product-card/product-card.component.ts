import { Component, Input, } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../product/product.component';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { ArianeComponent, Path } from '../../ariane/ariane.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [TranslateModule, FontAwesomeModule, RouterModule, ArianeComponent],
  templateUrl: 'product-card.component.html',
  styleUrl: 'product-card.component.scss'
})
export class ProductCardComponent {
  faBoxOpen = faBoxOpen;

  @Input()
  product: Product;

  @Input()
  previousPath: Path;

  constructor(private router: Router) {}

  goToProduct(): void {
    this.router.navigate([`/product/${this.product.id}`], { state: { previousPath: this.previousPath } })
  }
}
