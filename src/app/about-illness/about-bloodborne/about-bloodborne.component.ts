import { Component } from '@angular/core';
import { AboutIllnessComponent } from '../about-illness.component';
import { TranslateModule } from '@ngx-translate/core';
import { Path } from '../../ariane/ariane.component';

@Component({
  selector: 'app-about-bloodborne',
  standalone: true,
  imports: [AboutIllnessComponent, TranslateModule],
  templateUrl: './about-bloodborne.component.html',
  styleUrl: './about-bloodborne.component.scss'
})
export class AboutBloodborneComponent {
  path: Path = { name: 'products.about.bloodborne', link: '/bloodborne' };
}
