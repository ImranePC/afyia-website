import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { FooterComponent } from './components/footer/footer.component';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
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
    if (!this.cookie.get('language')) {
      this.cookie.set('language', DEFAULT_LANGUAGE);
    }

    this.translate.use(this.cookie.get('language'));
  }
}
