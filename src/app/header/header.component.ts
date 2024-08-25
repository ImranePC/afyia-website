import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @ViewChild('navBar')
  navBar!: ElementRef<HTMLElement>;

  previousScrollValue = 0;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.previousScrollValue > window.scrollY){
      this.navBar.nativeElement.style.top = "0"
      this.navBar.nativeElement.style.opacity = "1"
    } else {
      this.navBar.nativeElement.style.animationPlayState = ""
      this.navBar.nativeElement.style.top = "-20px"
      this.navBar.nativeElement.style.opacity = "0"
    }

    this.previousScrollValue = window.scrollY;
  }
}
