import { Component } from '@angular/core';
import { ArianeComponent } from '../../../components/ariane/ariane.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../../../services/app.service';
import { BannerComponent } from '../../../components/banner/banner.component';

@Component({
  selector: 'app-biotechnology',
  standalone: true,
  imports: [ArianeComponent, BannerComponent, TranslateModule],
  templateUrl: './biotechnology.component.html',
  styleUrl: './biotechnology.component.scss'
})
export class BiotechnologyComponent {

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
  }
}
