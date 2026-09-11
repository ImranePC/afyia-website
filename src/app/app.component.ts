import { AfterViewInit, Component, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { FooterComponent } from './components/footer/footer.component';
import localeFr from '@angular/common/locales/fr';
import { isPlatformBrowser, registerLocaleData } from '@angular/common';
import { filter, merge, startWith, Subscription } from 'rxjs';
import { AppService } from './services/app.service';
import { SeoService } from './services/seo.service';

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

  private seoSubscription?: Subscription;

  constructor(
    private cookie: CookieService,
    private translate: TranslateService,
    private router: Router,
    private appService: AppService,
    private seo: SeoService,
  ) {
    this.initLanguage();

    // Re-apply SEO on every navigation and whenever the active language changes
    // (on a hard reload the translations may not be loaded yet when NavigationEnd
    // fires, so `instant()` would return the raw key).
    this.seoSubscription = merge(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
      this.translate.onLangChange,
    ).pipe(startWith(null)).subscribe(() => this.applySeo());
  }

  /**
   * Applies per-route <title> / meta / canonical from the `seo` key on the route
   * data. Dynamic pages (product, news, illness) set their own tags from their
   * component instead.
   */
  private applySeo(): void {
    let snapshot: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    while (snapshot?.firstChild) {
      snapshot = snapshot.firstChild;
    }

    const key = snapshot?.data?.['seo'];
    if (!key) {
      return;
    }

    const noindex = snapshot?.data?.['noindex'] === true;

    this.translate
      .get([`seo.${key}.title`, `seo.${key}.description`])
      .subscribe((t) => {
        this.seo.update({
          title: t[`seo.${key}.title`],
          description: t[`seo.${key}.description`],
          path: this.router.url,
          robots: noindex ? 'noindex,follow' : undefined,
        });
      });
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
    this.seoSubscription?.unsubscribe();
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
