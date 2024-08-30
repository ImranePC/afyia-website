import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { ClickOutsideDirective } from '../directives/click-outside.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FontAwesomeModule, ClickOutsideDirective],
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

  constructor(private translate: TranslateService) {
  }

  @HostListener('window:scroll', ['$event'])
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

  isLangSelected(lang: string): boolean {
    return lang === this.translate.currentLang;
  }

  selectLang(lang: string): void {
    this.translate.use(lang);
  }

  toggleDropDown(dropdown: HTMLElement): void {
    if (dropdown.style.display === 'none') {
      dropdown.style.display = 'block';
    } else {
      dropdown.style.display = 'none'
    }
  }

  closeDropdown(dropdown: HTMLElement): void {
    dropdown.style.display = 'none';
  }

  openDropdown(dropdown: HTMLElement): void {
    dropdown.style.display = 'block';
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }
}
