import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../../../services/app.service';
import { BannerComponent } from '../../../components/banner/banner.component';
import { CarouselComponent, CarouselElement } from '../../../components/carousel/carousel.component';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [BannerComponent, CarouselComponent, TranslateModule],
  templateUrl: './health.component.html',
  styleUrl: './health.component.scss'
})
export class HealthComponent {

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

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
  }
}