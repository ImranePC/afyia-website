import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArianeComponent, Path } from '../../../components/ariane/ariane.component';
import { ParallaxDirective } from '../../../directives/parallax.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { News, NewsService } from '../../../services/news.service';
import { AppService } from '../../../services/app.service';
import { SeoService } from '../../../services/seo.service';
import { DatePipe } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { BannerComponent } from '../../../components/banner/banner.component';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [
    ArianeComponent,
    ParallaxDirective,
    TranslateModule,
    DatePipe,
    BannerComponent,
  ],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NewsPageComponent implements OnInit {
  data: News;

  formattedContent: string | SafeHtml;

  navigationPath: Path[] = [
    { name: 'header.news', link: '/news' },
    { name: '', link: '/news/:id' },
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private newsService: NewsService,
    private translate: TranslateService,
    private seo: SeoService,
  ) { }

  ngOnInit(): void {
    this.loadCurrentNews(true);

    this.translate.onLangChange.subscribe(() => {
      this.loadCurrentNews();
    })
  }

  loadCurrentNews(firstCall = false): void {
    const newsId = this.route.snapshot.paramMap.get('id');
    const language = this.translate.currentLang;

    this.newsService.getNewsById(newsId, true).subscribe((news) => {
      this.data = news;
      this.formattedContent = this.newsService.formatContent(this.data.content[this.translate.currentLang] as string);
      this.navigationPath[this.navigationPath.length - 1].name = this.data.title[language] as string;

      const title = this.data.title[language] as string;
      const excerpt = String(this.data.content[language] ?? '')
        .replace(/\{.*?\}|<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 160);
      this.seo.update({
        title: `${title} — AFYIA Diagnostics`,
        description: excerpt || title,
        path: this.router.url,
        image: this.data.fullBannerUrl,
        type: 'article',
      });

      if (firstCall) {
        this.appService.initScrollReveal();
      }
    });
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }
}
