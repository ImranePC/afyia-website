import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

const DEFAULT_LANGUAGE = 'fr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    HttpClientModule,
    TranslateModule,
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

    console.log(this.cookie.get('langlanguage'));

    this.translate.use(this.cookie.get('language'));
  }
}
