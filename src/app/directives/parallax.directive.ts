import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective {
  @Input('ratio')
  parallaxRatio: number = 0.15;

  initialOffsetTop: number = 0;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.initialOffsetTop = this.el.nativeElement.offsetTop;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.el.nativeElement.style.backgroundPositionY = `${(this.initialOffsetTop - window.scrollY * this.parallaxRatio)}px`;
  }
}
