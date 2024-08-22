import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective {
  @Input('ratio') parallaxRatio: number = 1;
  initialOffsetTop: number = 0;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.initialOffsetTop = this.el.nativeElement.offsetTop;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset;
    this.el.nativeElement.style.transform = `translateY(${(this.initialOffsetTop - scrollPosition * this.parallaxRatio)}px)`;
  }
}
