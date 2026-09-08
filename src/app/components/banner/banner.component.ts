import { afterNextRender, Component, computed, Input, OnDestroy } from '@angular/core';
import { AppService } from '../../services/app.service';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-banner',
  standalone: true,
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent implements OnDestroy {
  @Input()
  imageUrl: string;

  @Input()
  title: string | SafeHtml;

  @Input()
  titleSmall: boolean = false;

  @Input()
  dark = false;

  @Input()
  size: 'small' | 'large' = 'large';

  isSmall = computed(() => this.size === 'small');

  private observer: IntersectionObserver;

  constructor(private appService: AppService) {
    afterNextRender(() => {
      const banner = document.getElementById('banner');
      if (!banner) return;

      this.observer = new IntersectionObserver((entries) => {
        this.appService.setDark(entries[0].isIntersecting);
      })

      this.observer.observe(banner);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  reduceSize(): void {
    this.size = 'small';
  }
}
