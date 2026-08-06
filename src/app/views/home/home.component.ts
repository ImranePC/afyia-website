import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CardLinkComponent } from './card-link/card-link.component';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppService } from '../../services/app.service';
import { CtaComponent } from '../../components/cta/cta.component';
import { ParallaxDirective } from '../../directives/parallax.directive';
import { Product, ProductService } from '../../services/product.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map, startWith } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardLinkComponent,
    RouterLink,
    TranslateModule,
    CtaComponent,
    ParallaxDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  @ViewChild('scroller', { static: true })
  scroller!: ElementRef;

  currentStep: any = null;

  previousStep: any = null;

  startX = 0;

  scrollLeft = 0;

  isDragging = false;

  updatedScrollbar = false;

  isWindowSm: boolean;

  products: Product[];

  images: string[] = [
    'assets/img/team/img_mic.jpg',
    'assets/img/team/img_margot.jpg',
    'assets/img/team/img_ben_2.jpg',
    'assets/img/img_onehealth_sm.jpg',
    'assets/img/buildings_background_sm.jpg',
  ];

  isMobileLayout = toSignal(
    fromEvent(window, 'resize').pipe(
      startWith(null),
      map(() => window.innerWidth < 1280)
    ),
    { initialValue: window.innerWidth < 1280 }
  );

  constructor(private appService: AppService, private productService: ProductService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
    this.isWindowSm = window.screen.width <= 1200;

    this.productService.getFeaturedProducts().subscribe((data) => {
      this.products = data;
    });

    const mark1 = document.getElementById('mark_1');
    const approachTitle = document.getElementById('approach_title');
    const approachSection = document.getElementById('section_approach');
    const banner = document.getElementById('banner');

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

        if (entry.target.id === 'banner') {
          this.appService.setDark(entry.isIntersecting)
        }
      });
    }, {
      root: null,
      threshold: 0,
      rootMargin: '-100px 0px 0px 0px' // top | right | bottom | left
    });

    observer.observe(mark1);
    observer.observe(approachTitle);
    observer.observe(banner);
  }

  scrollTo(id: string): void {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.getElementById(id).scrollIntoView();
    document.documentElement.style.scrollBehavior = 'auto';
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }
}
