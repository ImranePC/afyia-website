import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BannerComponent } from '../../../components/banner/banner.component';
import { CarouselComponent, CarouselElement } from '../../../components/carousel/carousel.component';
import LocomotiveScroll from 'locomotive-scroll';

@Component({
  selector: 'app-biotechnology',
  standalone: true,
  imports: [CarouselComponent, BannerComponent, TranslateModule],
  templateUrl: './biotechnology.component.html',
  styleUrl: './biotechnology.component.scss'
})
export class BiotechnologyComponent {
  links: CarouselElement[] = [
    {
      title: 'header.technology',
      image: 'assets/img/banner/banner_software.webp',
      route: 'software',
    },
    {
      title: 'header.process',
      image: 'assets/img/img_process_2.jpg',
      route: 'industrial-process',
    },
    {
      title: 'header.health',
      image: 'assets/img/img_human_health.jpg',
      route: 'human-health',
    },
    {
      title: 'header.news',
      image: 'assets/img/banner/banner_news_alt.webp',
      route: 'news',
    }
  ];
}
