import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AppService } from '../../../services/app.service';
import { BannerComponent } from '../../../components/banner/banner.component';
import { CarouselComponent, CarouselElement } from '../../../components/carousel/carousel.component';
import { LocalizedLinkPipe } from '../../../pipes/localized-link.pipe';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [BannerComponent, CarouselComponent, TranslateModule, RouterModule, FontAwesomeModule, LocalizedLinkPipe],
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss'
})
export class ProcessComponent {
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
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
  }
}
