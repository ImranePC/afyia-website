import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { ParallaxDirective } from '../../directives/parallax.directive';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [ParallaxDirective],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent implements AfterViewInit, OnDestroy {
  @Input()
  imageUrl: string;

  @Input()
  title: string;

  private observer: IntersectionObserver;

  constructor(private appService: AppService) { }

  ngAfterViewInit(): void {
    const banner = document.getElementById('banner');
    this.observer = new IntersectionObserver((entries) => {
      this.appService.setDark(entries[0].isIntersecting);
    })

    this.observer.observe(banner);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
