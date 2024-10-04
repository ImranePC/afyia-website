import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ParallaxDirective } from '../directives/parallax.directive';
import { CardLinkComponent } from './card-link/card-link.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    ParallaxDirective,
    CardLinkComponent,
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

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();

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
            approachTitle.classList.remove('scale-95');
            approachTitle.classList.add('scale-100');
          }
        } else {
          if (entry.target.id === 'mark_1') {
            approachSection.style.transform = 'scale(0.9)';
            approachSection.style.opacity = '0.5';
            approachSection.style.filter = 'grayscale(50%)';

            approachTitle.style.opacity = '0.3';
            approachTitle.classList.remove('scale-100');
            approachTitle.classList.add('scale-95');
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

  scrollTo(id: string): void {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.getElementById(id).scrollIntoView();
    document.documentElement.style.scrollBehavior = 'auto';
  }
}
