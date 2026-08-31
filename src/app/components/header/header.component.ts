import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from '../../services/app.service';
import { LocalizedLinkPipe } from '../../pipes/localized-link.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    ClickOutsideDirective,
    TranslateModule,
    LocalizedLinkPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  previousScrollValue = 0;

  navHidden = false;

  menuOpen = false;

  langOpen = false;

  faBars = faBars;

  faTimes = faTimes;

  constructor(
    private translate: TranslateService,
    private cookie: CookieService,
    private appService: AppService,
    private router: Router,
  ) {
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.navHidden = window.scrollY > this.previousScrollValue && window.scrollY > 0;

    if (this.navHidden) {
      this.closeMenu();
    }

    this.previousScrollValue = window.scrollY;
  }

  isLanguageSelected(language: string): boolean {
    return language === this.translate.currentLang;
  }

  selectLanguage(language: string): void {
    this.cookie.set('language', language);

    const newUrl = this.router.url.replace(/^\/(fr|en)/, `/${language}`);
    window.location.href = newUrl;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    if (!this.menuOpen) {
      this.langOpen = false;
    }
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.langOpen = false;
  }

  toggleLang(event: MouseEvent): void {
    event.stopPropagation();
    this.langOpen = !this.langOpen;
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }

  get isDark(): boolean {
    return this.appService.isDark();
  }
}
