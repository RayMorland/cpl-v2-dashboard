import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewsService } from 'app/shared/services/news/news.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { forkJoin, Observable } from 'rxjs';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { News } from 'app/shared/models/news.model';

@Component({
  selector: 'app-news-edit',
  templateUrl: './news-edit.component.html',
  styleUrls: ['./news-edit.component.scss'],
  animations: [egretAnimations],
})
export class NewsEditComponent implements OnInit {
  formData = {};
  formReady = false;
  editMode = false;
  console = console;
  news: any;
  newsObs: Observable<any>;
  newsId: string;
  newsReady = false;
  article: News;

  newsForm: FormGroup;
  categories = ['meets', 'website'];

  private quillModules = {};

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router,
    private loader: AppLoaderService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // this.loader.open();
    this.initForm();

    this.route.params.subscribe((params: Params) => {
      if (params.hasOwnProperty('id')) {
        this.newsId = params.id;
        this.getData().subscribe((res) => {
          this.article = new News(res[0][0]);
          console.log(this.article);
          this.editMode = true;
          this.setFormValues();
          // this.loader.close();
          this.newsReady = true;
          this.changeDetectorRef.detectChanges();
        });
      } else {
        this.newsReady = true;
        this.article = new News();
      }
    });
  }

  private getData(): Observable<any> {
    const article = this.newsService.findNews(this.newsId);
    return forkJoin([article]);
  }

  public submitForm(): void {
    console.log(this.newsForm.value);

    this.article.title = this.titleControl.value;
    this.article.description = this.descriptionControl.value;
    this.article.subtitle = this.subtitleControl.value;
    this.article.category = this.categoryControl.value;
    this.article.author = this.authorControl.value;
    this.article.content = this.contentControl.value;

    if (this.editMode) {
      this.newsService.updateNews(this.article._id, this.article).subscribe((res) => {
        this.router.navigate(['/news/' + res._id]);
      }, (err) => {
        console.log(err);
      }, () => {

      });
    } else {
      this.newsService.createNews(this.article).subscribe((res) => {
        this.router.navigate(['/news/' + res._id]);
      }, (err) => {
        console.log(err);
      });
    }
  }

  private setFormValues() {
    this.titleControl.setValue(this.article.title);
    this.subtitleControl.setValue(this.article.subtitle);
    this.descriptionControl.setValue(this.article.description);
    this.authorControl.setValue(this.article.author);
    this.categoryControl.setValue(this.article.category);
    this.contentControl.setValue(this.article.content);
  }

  private initForm() {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      subtitle: [''],
      description: [''],
      category: [''],
      // Get author from current logged in user
      author: ['', Validators.required],
    });
  }

  private get titleControl() {
    return this.newsForm.get('title');
  }
  private get contentControl() {
    return this.newsForm.get('content');
  }
  private get subtitleControl() {
    return this.newsForm.get('subtitle');
  }
  private get descriptionControl() {
    return this.newsForm.get('description');
  }
  private get categoryControl() {
    return this.newsForm.get('category');
  }
  private get authorControl() {
    return this.newsForm.get('author');
  }
}
