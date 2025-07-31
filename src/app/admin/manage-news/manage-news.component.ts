import { Component, OnInit } from '@angular/core';
import { News, NewsService } from '../../services/news.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-news',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-news.component.html',
  styleUrl: './manage-news.component.scss'
})
export class ManageNewsComponent implements OnInit {
  newsList: News[] = [];

  constructor(
    private newsService: NewsService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.loadNews()

    this.translate.onLangChange.subscribe(() => {
      this.loadNews();
    });
  }

  loadNews(): void {
    this.newsService.getNews().subscribe((data: News[]) => {
      this.newsList = data;
    })
  }
}
