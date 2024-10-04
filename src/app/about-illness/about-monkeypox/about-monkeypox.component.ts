import { Component } from '@angular/core';
import { AboutIllnessComponent } from '../about-illness.component';
import { TranslateModule } from '@ngx-translate/core';
import { Path } from '../../ariane/ariane.component';

@Component({
  selector: 'app-about-monkeypox',
  standalone: true,
  imports: [AboutIllnessComponent, TranslateModule],
  templateUrl: './about-monkeypox.component.html',
  styleUrl: './about-monkeypox.component.scss'
})
export class AboutMonkeypoxComponent {
  path: Path = { name: 'about_illness.monkeypox.title', link: '/about-monkeypox' };
}
