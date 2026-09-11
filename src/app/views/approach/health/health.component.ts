import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BannerComponent } from '../../../components/banner/banner.component';
import { CarouselComponent, CarouselElement } from '../../../components/carousel/carousel.component';
import { RouterModule } from '@angular/router';
import { LocalizedLinkPipe } from '../../../pipes/localized-link.pipe';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [BannerComponent, CarouselComponent, TranslateModule, RouterModule, LocalizedLinkPipe, FontAwesomeModule],
  templateUrl: './health.component.html',
  styleUrl: './health.component.scss'
})
export class HealthComponent {
  faArrowRight = faArrowRight;

  links: CarouselElement[] = [
    {
      title: 'header.technology',
      image: 'assets/img/banner/banner_software.webp',
      route: 'software',
    },
    {
      title: 'header.biotechnology',
      image: 'assets/img/team/img_margot.jpg',
      route: 'biotechnology',
    },
    {
      title: 'header.process',
      image: 'assets/img/img_process_2.jpg',
      route: 'industrial-process',
    },
    {
      title: 'header.news',
      image: 'assets/img/banner/banner_news_alt.webp',
      route: 'news',
    }
  ];
}