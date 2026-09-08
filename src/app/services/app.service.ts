import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private route = inject(ActivatedRoute);

  private platformId = inject(PLATFORM_ID);

  isDark = signal(true);

  scroll?: { destroy: () => void };

  constructor() { }

  initLocomotiveScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    import('locomotive-scroll').then(({ default: LocomotiveScroll }) => {
      this.scroll = new LocomotiveScroll();
    });
  }

  destroyLocomotiveScroll(): void {
    this.scroll?.destroy();
    this.scroll = undefined;
  }

  initScrollReveal(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const config = {
      duration: 750,
      distance: '30px',
      origin: 'top',
      interval: 100,
    }

    import('scrollreveal').then(({ default: ScrollReveal }) => {
      ScrollReveal().reveal('.reveal', config);
    });
  }

  getRouteUrl(route: string[]) {
    const origin = isPlatformBrowser(this.platformId) ? window.location.origin : '';
    return origin + route.join('/')
  }

  path(...segments: string[]): string[] {
    const flat = segments.flatMap((segment: string) => segment.split('/')
      .filter((segment: string) => segment.length > 0));

    return [this.route.snapshot.paramMap.get('lang') ?? 'fr', ...flat];
  }

  setDark(value: boolean) {
    this.isDark.set(value);
  }
}
