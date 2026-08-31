import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedLinkPipe } from '../../pipes/localized-link.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TranslateModule, FontAwesomeModule, LocalizedLinkPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  faUpRightFromSquare = faUpRightFromSquare;
}
