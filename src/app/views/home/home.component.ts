import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CardLinkComponent } from './card-link/card-link.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../../services/app.service';
import { CtaComponent } from '../../components/cta/cta.component';
import { LocalizedLinkPipe } from '../../pipes/localized-link.pipe';
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
    LocalizedLinkPipe,
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

  aboutFloatingImages = [
    { src: 'assets/img/team/img_margot.jpg', wrapperClass: 'hidden lg:block -top-10 -left-8 lg:-left-16 w-40 lg:w-80', cardClass: '-rotate-6', speed: 0.04 },
    { src: 'assets/img/team/img_team.jpg', wrapperClass: 'hidden lg:block -top-16 right-8 lg:-right-10 w-40 lg:w-96', cardClass: 'rotate-6', speed: -0.04 },
    { src: 'assets/img/team/img_ben_2.jpg', wrapperClass: 'hidden lg:block -bottom-12 left-12 lg:left-20 w-32 lg:w-72', cardClass: 'rotate-3', speed: -0.02 },
    { src: 'assets/img/buildings_background_sm.jpg', wrapperClass: 'hidden lg:block -bottom-8 -right-6 lg:-right-16 w-32 lg:w-64', cardClass: '-rotate-6', speed: 0.02 },
  ];

  isMobileLayout = toSignal(
    fromEvent(window, 'resize').pipe(
      startWith(null),
      map(() => window.innerWidth < 1280)
    ),
    { initialValue: window.innerWidth < 1280 }
  );

  constructor(private appService: AppService, private productService: ProductService) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
    this.isWindowSm = window.screen.width <= 1200;

    this.productService.getFeaturedProducts().subscribe((data) => {
      this.products = data;
    });

    const banner = document.getElementById('banner');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === 'banner') {
          this.appService.setDark(entry.isIntersecting)
        }
      });
    }, {
      root: null,
      threshold: 0,
      rootMargin: '-100px 0px 0px 0px' // top | right | bottom | left
    });

    observer.observe(banner);
  }

  scrollTo(id: string): void {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.getElementById(id).scrollIntoView();
    document.documentElement.style.scrollBehavior = 'auto';
  }
}
