import { Component, OnInit } from '@angular/core';
import { ParallaxDirective } from '../../directives/parallax.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppService } from '../../services/app.service';
import { RouterModule } from '@angular/router';
import { News, NewsService } from '../../services/news.service';
import { ArianeComponent, Path } from '../../components/ariane/ariane.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { LocalizedLinkPipe } from '../../pipes/localized-link.pipe';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    ParallaxDirective,
    TranslateModule,
    RouterModule,
    ArianeComponent,
    BannerComponent,
    LocalizedLinkPipe,
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  newsList: News[] = []

  navigationPath: Path[] = [
    { name: 'header.news', link: '/news' },
  ]

  constructor(
    private appService: AppService,
    private newsService: NewsService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.loadNews();

    this.translate.onLangChange.subscribe(() => {
      this.loadNews();
    });
  }

  loadNews(): void {
    this.newsService.getNews().subscribe((data: News[]) => {
      this.newsList = data;

      setTimeout(() => {
        this.appService.destroyLocomotiveScroll();
        this.appService.initLocomotiveScroll();
      });
    });
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }
}
