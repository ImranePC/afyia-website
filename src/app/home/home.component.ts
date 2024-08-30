import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import ScrollReveal from 'scrollreveal';
import { ParallaxDirective } from '../directives/parallax.directive';
import { CardLinkComponent } from './card-link/card-link.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    ParallaxDirective,
    CardLinkComponent,
    FooterComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentStep: any = null;

  previousStep: any = null;

  constructor(translate: TranslateService) {
    translate.use('fr');
  }

  ngOnInit(): void {
    const config = {
      duration: 750,
      distance: '30px',
      origin: 'top',
    }

    ScrollReveal().reveal('.reveal', config);

    const mark1 = document.getElementById('mark_1');
    const approachTitle = document.getElementById('approach_title');
    const approachSection = document.getElementById('section_approach');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'mark_1') {
            approachSection.style.transform = 'scale(1)';
            approachSection.style.opacity = '1';
            approachSection.style.filter = 'grayscale(0%)';

            approachTitle.style.opacity = '1';
            approachTitle.classList.remove('-translate-y-20');
            approachTitle.classList.add('-translate-y-10');
          }
        } else {
          if (entry.target.id === 'mark_1') {
            approachSection.style.transform = 'scale(0.9)';
            approachSection.style.opacity = '0.5';
            approachSection.style.filter = 'grayscale(50%)';

            approachTitle.style.opacity = '0';
            approachTitle.classList.remove('-translate-y-10');
            approachTitle.classList.add('-translate-y-20');
          }
        }
      });
    }, {
      root: null,
      threshold: 0,
    });

    observer.observe(mark1);
    observer.observe(approachTitle);
  }

  showCard(element: HTMLElement) {
    element.style.opacity = '1';
  }

  hideCard(element: HTMLElement) {
    element.style.opacity = '0';
  }

  updateStep(step: string): void {
    this.previousStep = this.currentStep;
    this.currentStep = step;
  }
}
