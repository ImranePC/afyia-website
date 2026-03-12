import { Component } from '@angular/core';
import { AboutIllnessComponent } from '../about-illness.component';
import { Path } from '../../../components/ariane/ariane.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-illness-a',
  standalone: true,
  imports: [AboutIllnessComponent, TranslateModule],
  templateUrl: './about-illness-a.component.html',
  styleUrl: './about-illness-a.component.scss'
})
export class AboutIllnessAComponent {
  path: Path = { name: 'products.about.febrilerash', link: '/febrile-rash' };
}
