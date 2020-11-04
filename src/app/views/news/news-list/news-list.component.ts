import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { NewsService } from 'app/shared/services/news/news.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { News } from 'app/shared/models/news.model';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
  animations: [egretAnimations]
})
export class NewsListComponent implements OnInit {
  public isSideNavOpen: boolean;
  public viewMode: string = 'grid-view';
  public currentPage: any;
  @ViewChild(MatSidenav, { static: false }) private sideNav: MatSidenav;

  public news: News;
  public newsReady = false;
  public categories$: Observable<any>;
  public activeCategory: string = 'all';
  public filterForm: FormGroup;
  public cartData: any;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private newsService: NewsService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loader.open();
    this.getNews();
  }

  ngOnDestroy() {

  }

  getNews() {
    this.newsService
      .getNews()
      .subscribe(news => {
        this.news = news;
        console.log(this.news);
        this.loader.close();
        this.newsReady = true;
        this.changeDetectorRef.detectChanges();
      });
  }

  buildFilterForm(filterData: any = {}) {
    this.filterForm = this.fb.group({
      search: [''],
      category: ['all'],
      minPrice: [filterData.minPrice],
      maxPrice: [filterData.maxPrice],
      minRating: [filterData.minRating],
      maxRating: [filterData.maxRating]
    })
  }
  setActiveCategory(category) {
    this.activeCategory = category;
    this.filterForm.controls['category'].setValue(category);
  }

  toggleSideNav() {
    this.sideNav.opened = !this.sideNav.opened;
  }
}
