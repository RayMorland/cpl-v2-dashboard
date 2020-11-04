import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { News } from 'app/shared/models/news.model';
import { NewsService } from 'app/shared/services/news/news.service';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-news-overview',
  templateUrl: './news-overview.component.html',
  styleUrls: ['./news-overview.component.scss'],
  animations: [egretAnimations]
})
export class NewsOverviewComponent implements OnInit {
  public news: News[];
  public newsReady = false;

  constructor(
    private newsService: NewsService,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef

  ) { }

  ngOnInit() {
    this.getnews();
  }

  getnews() {
    this.newsService
      .getNews()
      .subscribe(news => {
        this.news = news;
        this.loader.close();
        this.newsReady = true;
        this.changeDetectorRef.detectChanges();
      });
  }

}
