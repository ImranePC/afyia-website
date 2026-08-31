import { Component } from '@angular/core';
import { ArianeComponent } from '../../../components/ariane/ariane.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../../../services/app.service';
import { BannerComponent } from '../../../components/banner/banner.component';
import { CarouselComponent, CarouselElement } from '../../../components/carousel/carousel.component';

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

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
  }
}
