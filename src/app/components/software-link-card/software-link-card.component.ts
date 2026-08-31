import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedLinkPipe } from '../../pipes/localized-link.pipe';

@Component({
  selector: 'app-software-link-card',
  standalone: true,
  imports: [RouterModule, TranslateModule, LocalizedLinkPipe],
  templateUrl: './software-link-card.component.html',
  styleUrl: './software-link-card.component.scss'
})
export class SoftwareLinkCardComponent {}
