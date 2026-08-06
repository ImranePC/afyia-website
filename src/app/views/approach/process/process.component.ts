import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { AppService } from '../../../services/app.service';
import { BannerComponent } from '../../../components/banner/banner.component';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [BannerComponent, TranslateModule, RouterModule, FontAwesomeModule],
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss'
})
export class ProcessComponent {
  faArrowRight = faArrowRight;

  constructor(
    private appService: AppService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
  }
}
