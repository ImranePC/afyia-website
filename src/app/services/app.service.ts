import { Injectable, signal } from '@angular/core';
import ScrollReveal from 'scrollreveal';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  isDark = signal(true);

  private darkTimeout: any;

  constructor() { }

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

  setDark(value: boolean) {
    this.isDark.set(value);
  }
}
