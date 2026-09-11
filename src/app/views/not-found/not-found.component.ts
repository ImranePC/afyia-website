import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  constructor(public translate: TranslateService) {}

  get lang(): string {
    return this.translate.currentLang || 'fr';
  }
}
