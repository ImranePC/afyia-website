import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ScrollReveal from 'scrollreveal';
import LocomotiveScroll from 'locomotive-scroll';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private route = inject(ActivatedRoute);

  isDark = signal(true);

  scroll?: LocomotiveScroll;

  constructor() { }

  initLocomotiveScroll(): void {
    this.scroll = new LocomotiveScroll();
  }

  destroyLocomotiveScroll(): void {
    this.scroll?.destroy();
    this.scroll = undefined;
  }

  initScrollReveal(): void {
    const config = {
      duration: 750,
      distance: '30px',
      origin: 'top',
      interval: 100,
    }

    ScrollReveal().reveal('.reveal', config);
  }

  getRouteUrl(route: string[]) {
    return window.location.origin + route.join('/')
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
