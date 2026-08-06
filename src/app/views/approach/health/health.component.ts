import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../../../services/app.service';
import { BannerComponent } from '../../../components/banner/banner.component';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [BannerComponent, TranslateModule],
  templateUrl: './health.component.html',
  styleUrl: './health.component.scss'
})
export class HealthComponent {

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
  }
}