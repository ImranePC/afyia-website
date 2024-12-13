import { Component, OnInit } from '@angular/core';
import { ParallaxDirective } from '../directives/parallax.directive';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../services/app.service';
import { RouterModule } from '@angular/router';
import { NewsService } from '../services/news.service';
import { ArianeComponent, Path } from '../ariane/ariane.component';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    ParallaxDirective,
    TranslateModule,
    RouterModule,
    ArianeComponent,
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  newsList: any[] = []

  navigationPath: Path[] = [
    { name: 'header.news', link: '/news' },
  ]

  constructor(
    private appService: AppService,
    private newsService: NewsService,
  ) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
    this.newsService.getNews().subscribe((data) => {
      this.newsList = data;
    })
  }
}
