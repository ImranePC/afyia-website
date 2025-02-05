import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArianeComponent, Path } from '../../ariane/ariane.component';
import { ParallaxDirective } from '../../directives/parallax.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { News, NewsService } from '../../services/news.service';
import { AppService } from '../../services/app.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

  navigationPath: Path[] = [
    { name: 'header.news', link: '/news' },
    { name: '', link: '/news/:id' },
  ]

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private newsService: NewsService,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.loadCurrentNews(true);

    this.translate.onLangChange.subscribe(() => {
      this.loadCurrentNews();
    })
  }

  loadCurrentNews(firstCall = false): void {
    const newsId = this.route.snapshot.paramMap.get('id');

    this.newsService.getNewsById(newsId).subscribe((news) => {
      this.data = news;
      this.data.content = this.formatContent(this.data.content as string);
      this.navigationPath[this.navigationPath.length - 1].name = this.data.title;

      if (firstCall) {
        this.appService.initScrollReveal();
      }
    });
  }

  formatContent(content: string): SafeHtml {
    const regex = new RegExp('{\\s*img:(.*?)\\s*}', 'g');

    return this.sanitizer.bypassSecurityTrustHtml(
      content.replace(regex, (match: any, image: string) => {
        return `<img src="assets/img/news/${image}" title="" alt="">`;
      })
    );
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }
}
