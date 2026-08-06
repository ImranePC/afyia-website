import { Component, Input, } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { Path } from '../../../components/ariane/ariane.component';
import { Product } from '../../../services/product.service';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [TranslateModule, FontAwesomeModule, RouterModule],
  templateUrl: 'product-card.component.html',
  styleUrl: 'product-card.component.scss'
})
export class ProductCardComponent {
  faBoxOpen = faBoxOpen;

  @Input()
  product: Product;

  @Input()
  previousPath: Path;

  constructor(private router: Router, private app: AppService) {}

  goToProduct(): void {
    this.router.navigate(this.app.path('product', this.product.id), { state: { previousPath: this.previousPath } })
  }
}
