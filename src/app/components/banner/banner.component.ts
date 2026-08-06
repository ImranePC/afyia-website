import { AfterViewInit, Component, computed, Input, OnDestroy } from '@angular/core';
import { ParallaxDirective } from '../../directives/parallax.directive';
import { AppService } from '../../services/app.service';
import { SafeHtml } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { ParallaxImgDirective } from '../../directives/parallax-img.directive';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [ParallaxDirective, ParallaxImgDirective, NgOptimizedImage],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent implements AfterViewInit, OnDestroy {
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

  constructor(private appService: AppService) { }

  ngAfterViewInit(): void {
    const banner = document.getElementById('banner');
    this.observer = new IntersectionObserver((entries) => {
      this.appService.setDark(entries[0].isIntersecting);
    })

    this.observer.observe(banner);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  reduceSize(): void {
    this.size = 'small';
  }
}
