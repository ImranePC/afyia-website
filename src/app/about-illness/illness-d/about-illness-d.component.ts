import { Component } from '@angular/core';
import { AboutIllnessComponent } from '../about-illness.component';
import { TranslateModule } from '@ngx-translate/core';
import { Path } from '../../ariane/ariane.component';

@Component({
  selector: 'app-about-illness-d',
  standalone: true,
  imports: [AboutIllnessComponent, TranslateModule],
  templateUrl: './about-illness-d.component.html',
  styleUrl: './about-illness-d.component.scss'
})
export class AboutIllnessDComponent {
  path: Path = { name: 'products.about.tuberculosis', link: '/tuberculosis' };
}
