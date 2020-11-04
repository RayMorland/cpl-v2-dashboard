import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NewsService } from 'app/shared/services/news/news.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { News } from 'app/shared/models/news.model';
import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.scss'],
  animations: [egretAnimations]
})
export class NewsDetailsComponent implements OnInit {

  news: News;
  newsReady = false;
  newsId: string;

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private loader: AppLoaderService

  ) { }

  ngOnInit() {
    this.loader.open();

    this.route.params.subscribe(
      (params: Params) => {
        if (params.hasOwnProperty('id')) {
          this.newsId = params.id;
          this.getNewsArticle(this.newsId);
        } else {
          
        }
      }
    );
  }

  getNewsArticle(id: string) {
    this.newsService
      .findNews(id)
      .subscribe(news => {
        this.news = news[0];
        this.loader.close();
        this.newsReady = true;
        this.changeDetectorRef.detectChanges();
      });
  }

}
