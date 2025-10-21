import { Component } from '@angular/core';
import { AboutIllnessComponent } from '../about-illness.component';
import { TranslateModule } from '@ngx-translate/core';
import { Path } from '../../ariane/ariane.component';

@Component({
  selector: 'app-about-illness-c',
  standalone: true,
  imports: [AboutIllnessComponent, TranslateModule],
  templateUrl: './about-illness-c.component.html',
  styleUrl: './about-illness-c.component.scss'
})
export class AboutIllnessCComponent {
  path: Path = { name: 'products.about.respiratory', link: '/respiratory' };
}
