import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-card-link',
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule],
  templateUrl: './card-link.component.html',
  styleUrl: './card-link.component.scss'
})
export class CardLinkComponent {
  @Input()
  title = 'Title';

  @Input()
  subTitle = '';

  @Input()
  description = '';

  @Input()
  link = false;

  @Input()
  imagePath = '';

  @Input()
  ce = false;

  faUpRightFromSquare = faUpRightFromSquare;
}
