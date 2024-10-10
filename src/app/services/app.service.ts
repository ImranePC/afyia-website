import { Injectable } from '@angular/core';
import ScrollReveal from 'scrollreveal';

@Injectable({
  providedIn: 'root'
})
export class AppService {

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
}
