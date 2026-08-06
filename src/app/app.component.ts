import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { FooterComponent } from './components/footer/footer.component';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

const DEFAULT_LANGUAGE = 'fr';
registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    TranslateModule,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'afyia-website';

  scroll: any;

  constructor(private cookie: CookieService, private translate: TranslateService) {
    this.initLanguage();
  }

  ngAfterViewInit(): void {
  }

  initLanguage(): void {
    if (!this.cookie.get('language')) {
      this.cookie.set('language', DEFAULT_LANGUAGE);
    }

    this.translate.use(this.cookie.get('language'));
  }
}
