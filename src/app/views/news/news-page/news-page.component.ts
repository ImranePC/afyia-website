import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArianeComponent, Path } from '../../../components/ariane/ariane.component';
import { ParallaxDirective } from '../../../directives/parallax.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { News, NewsService } from '../../../services/news.service';
import { AppService } from '../../../services/app.service';
import { DatePipe } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [
    ArianeComponent,
    ParallaxDirective,
    TranslateModule,
    DatePipe,
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
    private appService: AppService,
    private newsService: NewsService,
    private translate: TranslateService,
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

      if (firstCall) {
        this.appService.initScrollReveal();
      }
    });
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }
}
