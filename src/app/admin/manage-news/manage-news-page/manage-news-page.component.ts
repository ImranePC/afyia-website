import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { News, NewsService } from '../../../services/news.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { AppService } from '../../../services/app.service';
import { ModalComponent } from '../../../modal/modal.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-manage-news-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalComponent],
  templateUrl: './manage-news-page.component.html',
  styleUrl: './manage-news-page.component.scss'
})
export class ManageNewsPageComponent implements OnInit {
  @ViewChild('saveModal')
  saveModal: ModalComponent;

  @ViewChild('saveImageModal')
  saveImageModal: ModalComponent;

  @ViewChild('errorModal')
  errorModal: ModalComponent;

  @ViewChild('fileInput')
  fileInput: ElementRef<HTMLInputElement>;;

  data: News;

  selectedLang: 'fr' | 'en' = 'fr'

  selectedFile: File | null = null;

  imagesList: string[] = [];

  isEditMode = false;

  constructor(
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    const newsId = this.route.snapshot.paramMap.get('id');

    this.isEditMode = !!newsId;

    if (this.isEditMode) {
      this.newsService.getNewsById(newsId, true).subscribe((news) => {
        this.data = news;
        console.log(this.data);
      })
    } else {
      this.initData();
  }

    this.getImagesList();
  }

  getRouteUrl(route: string[]): string {
    return this.appService.getRouteUrl(route);
  }

  save(): void {
    if (this.isEditMode) {
      this.newsService.updateNews(this.data).subscribe({
        next: () => {
          this.saveModal.open();
        }, error: () => {
          this.errorModal.open();
        }
      });

      return;
    }

    this.newsService.createNews(this.data).subscribe({
      next: (response: any) => {
        this.saveModal.open();
        this.initData();
        this.fileInput.nativeElement.value = '';
        this.selectedFile = null;
      }, error: () => {
        this.errorModal.open();
      }
    })
  }

  initData(): void {
    this.data = new News(
      undefined,
      {
        'fr': undefined,
        'en': undefined,
      },
      {
        'fr': undefined,
        'en': undefined,
      },
      '',
      '',
      new Date().toLocaleDateString('en-CA'),
    );
  }

  onFileSelected(event: Event): void {
    if (this.fileInput.nativeElement.files && this.fileInput.nativeElement.files.length > 0) {
      this.selectedFile = this.fileInput.nativeElement.files[0];
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.apiService.uploadImage(formData).subscribe({
      next: () => {
        this.fileInput.nativeElement.value = '';
        this.selectedFile = null;

        this.saveImageModal.open();
        this.getImagesList();
      }, error: () => {
        this.errorModal.open();
      }
    });
  }

  getImagesList(): void {
    this.apiService.getImagesList().subscribe((data: any) => {
      this.imagesList = data.files;
    })
  }

  remove(): void {
    if (confirm(`Voulez-vous vraiment supprimer l\'article : ${this.data.title['fr']}`)) {
      this.newsService.deleteNews(this.data.id).subscribe({
        next: () => {
          this.router.navigate(['/admin/manage-news']);
        }, error: () => {
          this.errorModal.open();
        }
      });
    }
  }

  get isDataValid(): boolean {
    const values = [
      this.data.bannerUrl,
      this.data.imageUrl,
      this.data.content['fr'],
      this.data.content['en'],
      this.data.publishedAt,
      this.data.title['fr'],
      this.data.title['en'],
    ];

    return !values.some((value: any) => ['', undefined, null].includes(value));
  }

  get formattedContent(): SafeHtml {
    if (!this.data.content[this.selectedLang]) {
      return '';
    }

    return this.newsService.formatContent(this.data.content[this.selectedLang] as string);
  }

  get imageUrl(): string {
    return this.newsService.IMAGE_URL;
  }
}
