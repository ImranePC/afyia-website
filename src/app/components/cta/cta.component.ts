import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NewsletterButtonComponent } from '../newsletter-button/newsletter-button.component';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [TranslateModule, RouterModule, NewsletterButtonComponent],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.scss'
})
export class CtaComponent {
  @Input()
  newsletter: boolean = false;
}
