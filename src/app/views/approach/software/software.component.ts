import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ParallaxDirective } from '../../../directives/parallax.directive';
import { AppService } from '../../../services/app.service';
import { ArianeComponent, Path } from '../../../components/ariane/ariane.component';
import {
  faComputer,
  faPenNib,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../../../components/banner/banner.component';
import { CarouselComponent, CarouselElement } from '../../../components/carousel/carousel.component';

@Component({
  selector: 'app-software',
  standalone: true,
  imports: [
    CarouselComponent,
    TranslateModule,
    FontAwesomeModule,
    CommonModule,
    RouterModule,
    BannerComponent,
  ],
  templateUrl: './software.component.html',
  styleUrl: './software.component.scss'
})
export class SoftwareComponent {
  faComputer = faComputer;

  faPenNib = faPenNib;

  navigationPath: Path[] = [
    { name: 'header.technology', link: '/technology' },
    { name: 'software.title', link: '/software' },
  ]

  links: CarouselElement[] = [
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
      title: 'header.health',
      image: 'assets/img/img_human_health.jpg',
      route: 'human-health',
    },
    {
      title: 'header.news',
      image: 'assets/img/img_human_health.jpg',
      route: 'news',
    }
  ];

  constructor(
    private appService: AppService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    // this.appService.initScrollReveal();
  }
}
