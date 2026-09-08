import { AfterViewInit, Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { FooterComponent } from './components/footer/footer.component';
import localeFr from '@angular/common/locales/fr';
import { isPlatformBrowser, registerLocaleData } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { AppService } from './services/app.service';

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
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'afyia-website';

  private platformId = inject(PLATFORM_ID);

  private routerEventsSubscription?: Subscription;

  constructor(
    private cookie: CookieService,
    private translate: TranslateService,
    private router: Router,
    private appService: AppService,
  ) {
    this.initLanguage();
  }

  ngAfterViewInit(): void {
    this.appService.initLocomotiveScroll();

    this.routerEventsSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => setTimeout(() => {
        this.appService.destroyLocomotiveScroll();
        this.appService.initLocomotiveScroll();
      }));
  }

  ngOnDestroy(): void {
    this.routerEventsSubscription?.unsubscribe();
    this.appService.destroyLocomotiveScroll();
  }

  initLanguage(): void {
    const supported = ['fr', 'en'];
    let lang = DEFAULT_LANGUAGE;

    if (isPlatformBrowser(this.platformId)) {
      const urlLang = window.location.pathname.split('/').filter(Boolean)[0];
      lang = supported.includes(urlLang)
        ? urlLang
        : this.cookie.get('language') || DEFAULT_LANGUAGE;

      this.cookie.set('language', lang);
    }

    this.translate.setDefaultLang(DEFAULT_LANGUAGE);
    this.translate.use(lang);
  }
}
