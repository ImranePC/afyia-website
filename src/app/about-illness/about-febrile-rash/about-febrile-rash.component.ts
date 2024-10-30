import { Component } from '@angular/core';
import { AboutIllnessComponent } from '../about-illness.component';
import { Path } from '../../ariane/ariane.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-febrile-rash',
  standalone: true,
  imports: [AboutIllnessComponent, TranslateModule],
  templateUrl: './about-febrile-rash.component.html',
  styleUrl: './about-febrile-rash.component.scss'
})
export class AboutFebrileRashComponent {
  path: Path = { name: 'products.about.febrilerash', link: '/febrile-rash' };
}
