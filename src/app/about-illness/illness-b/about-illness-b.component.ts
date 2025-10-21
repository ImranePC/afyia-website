import { Component } from '@angular/core';
import { AboutIllnessComponent } from '../about-illness.component';
import { Path } from '../../ariane/ariane.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-illness-b',
  standalone: true,
  imports: [AboutIllnessComponent, TranslateModule],
  templateUrl: './about-illness-b.component.html',
  styleUrl: './about-illness-b.component.scss'
})
export class AboutIllnessBComponent {
  path: Path = { name: 'products.about.febrilerash', link: '/febrile-rash' };
}
