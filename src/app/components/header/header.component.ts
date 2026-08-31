import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons';
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
  @ViewChild('navBar')
  navBar: ElementRef<HTMLElement>;

  @ViewChild('langDropDown')
  dropDown: ElementRef<HTMLElement>;

  previousScrollValue = 0;

  faCaretDown = faCaretDown;

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
    if (this.previousScrollValue > window.scrollY){
      this.navBar.nativeElement.style.top = "0"
      this.navBar.nativeElement.style.opacity = "1"
      this.navBar.nativeElement.style.pointerEvents = 'all';
    } else {
      this.navBar.nativeElement.style.animationPlayState = ""
      this.navBar.nativeElement.style.top = "-20px"
      this.navBar.nativeElement.style.opacity = "0"
      this.navBar.nativeElement.style.pointerEvents = 'none';
    }

    this.previousScrollValue = window.scrollY;
  }

  isLanguageSelected(language: string): boolean {
    return language === this.translate.currentLang;
  }

  selectLanguage(language: string): void {
    this.cookie.set('language', language);

    const currentUrl = this.router.url;
    const newUrl = currentUrl.replace(/^\/(fr|en)/, `${language}`);
    window.location.href = newUrl;
  }

  toggleDropDown(dropdown: HTMLElement): void {
    if (dropdown.style.display === 'none') {
      dropdown.style.display = 'block';
    } else {
      dropdown.style.display = 'none'
    }
  }

  closeDropdown(dropdown: HTMLElement, event: any): void {
    event.stopPropagation();
    dropdown.style.display = 'none';
  }

  openDropdown(dropdown: HTMLElement, event: any): void {
    event.stopPropagation();
    dropdown.style.display = 'block';
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }

  get isDark(): boolean {
    return this.appService.isDark();
  }
}
