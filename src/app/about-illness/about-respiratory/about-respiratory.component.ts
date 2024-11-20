import { Component } from '@angular/core';
import { AboutIllnessComponent } from '../about-illness.component';
import { TranslateModule } from '@ngx-translate/core';
import { Path } from '../../ariane/ariane.component';

@Component({
  selector: 'app-about-respiratory',
  standalone: true,
  imports: [AboutIllnessComponent, TranslateModule],
  templateUrl: './about-respiratory.component.html',
  styleUrl: './about-respiratory.component.scss'
})
export class AboutRespiratoryComponent {
  path: Path = { name: 'products.about.respiratory', link: '/respiratory' };
}
