import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDna, faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-business-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, FontAwesomeModule],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss'
})
export class BusinessCardComponent {
  @Input()
  person: 'pourquier' | 'guy' | 'reynes' | 'avarre' = 'guy';

  @Input()
  name = 'NAME name';

  isFlipped = false;

  isHover = false;

  faDna = faDna;

  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }
}
