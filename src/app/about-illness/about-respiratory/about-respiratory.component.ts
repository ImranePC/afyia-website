import { Component } from '@angular/core';
import { AboutIllnessComponent } from '../about-illness.component';
import { TranslateModule } from '@ngx-translate/core';
import { Path } from '../../ariane/ariane.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faViruses } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-about-respiratory',
  standalone: true,
  imports: [AboutIllnessComponent, TranslateModule, FontAwesomeModule],
  templateUrl: './about-respiratory.component.html',
  styleUrl: './about-respiratory.component.scss'
})
export class AboutRespiratoryComponent {
  path: Path = { name: 'products.about.respiratory', link: '/respiratory' };

  faViruses = faViruses;
}
