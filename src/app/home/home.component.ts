import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ParallaxDirective } from '../directives/parallax.directive';
import { CardLinkComponent } from './card-link/card-link.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../services/app.service';
import { CtaComponent } from '../cta/cta.component';

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
    CtaComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('scroller', { static: true })
  scroller!: ElementRef;

  currentStep: any = null;

  previousStep: any = null;

  startX = 0;

  scrollLeft = 0;

  isDragging = false;

  updatedScrollbar = false;

  isWindowSm: boolean;

  images: string[] = [
    'assets/img/team/img_mic.jpg',
    'assets/img/team/img_margot.jpg',
    'assets/img/team/img_ben_2.jpg',
    'assets/img/img_onehealth_sm.jpg',
    'assets/img/buildings_background_sm.jpg',
  ];

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
    this.isWindowSm = window.screen.width <= 1200;

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

  ngAfterViewInit() {
    setTimeout(() => {
      const container = this.scroller.nativeElement;
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;

      this.updateScrollerImages();
    }, 0);
  }

  startDrag(event: MouseEvent): void {
    this.isDragging = true;

    this.startX = event.pageX - this.scroller.nativeElement.offsetLeft;
    this.scrollLeft = this.scroller.nativeElement.scrollLeft;
    this.scroller.nativeElement.style.cursor = 'grabbing';
  }

  endDrag(event: MouseEvent): void {
    this.isDragging = false;
    this.scroller.nativeElement.style.cursor = 'grab';
  }

  onDrag(event: MouseEvent): void {
    if (!this.isDragging) {
      return;
    }
    event.preventDefault();

    const x = event.pageX - this.scroller.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.5;
    this.scroller.nativeElement.scrollLeft = this.scrollLeft - walk;

    this.updateScrollerImages();
  }

  updateScrollerImages(): void {
    if (this.isWindowSm) {
      return;
    }

    const images = Object.values(this.scroller.nativeElement.children);
    const maxRotation = 10;
    const maxTranslation = 80;

    // const scrollPercentage = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;

    images.forEach((image: any) => {
      const imageRect = image.getBoundingClientRect();

      const ratio = (imageRect.left / (window.innerWidth - imageRect.width)) * 2 - 1;
      const rotation = ratio * maxRotation;

      const ease = (t: number) => t * t;
      const adjustedRatio = ratio < 0 ? -ease(Math.abs(ratio)) : ease(ratio);
      const translateY = Math.abs(adjustedRatio) * maxTranslation;
      // const opacity = Math.max((1 - Math.abs(ratio)) * 2.5, 0.3);

      image.style.transform = `translateY(${translateY}px) rotate(${rotation}deg)`;
      // image.style.opacity = opacity;
    });
  }

  updateScrollerImages2(): void {
    const images = Object.values(this.scroller.nativeElement.children);
    const container = this.scroller.nativeElement;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    const maxRotation = 10;
    const maxTranslation = 40;

    images.forEach((image: any) => {
      const distanceFromCenter = (image.offsetLeft + image.clientWidth / 2) - containerCenter;
      const ratio = distanceFromCenter / (container.clientWidth / 2);

      const ease = (t: number) => t * t;
      const adjustedRatio = ratio < 0 ? -ease(Math.abs(ratio)) : ease(ratio);

      const rotation = adjustedRatio * maxRotation;
      const translateY = Math.abs(adjustedRatio) * maxTranslation;

      image.style.transform = `translateY(${translateY}px) rotate(${rotation}deg)`;
    });
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
