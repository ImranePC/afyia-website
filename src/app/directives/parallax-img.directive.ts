import { Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';

@Directive({
  selector: '[appParallaxImg]',
  standalone: true
})
export class ParallaxImgDirective {
  @Input('ratio')
  parallaxRatio: number = 0.15;

  @Input()
  offsetY = 0;

  initialOffsetTop: number = 0;

  private initialScrollY = 0;

  private ticking = false;

  private currentY = 0;

  private targetY = 0;

  constructor(private el: ElementRef, private ngZone: NgZone) { }

  ngOnInit() {
    this.initialOffsetTop = this.el.nativeElement.offsetTop + this.offsetY;
    this.initialScrollY = window.scrollY;
    this.onWindowScroll();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.ticking) {
      this.ticking = true;

      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          this.applyTransform();
          this.ticking = false;
        })
      })
    }
  }

  private applyTransform() {
    const delta = window.scrollY - this.initialScrollY;
    this.targetY = -delta * this.parallaxRatio;

    // lerp : on avance de 15% de la distance restante à chaque frame
    this.currentY += (this.targetY - this.currentY) * 0.3;

    this.el.nativeElement.style.transform = `translateY(${this.currentY}px)`;

    requestAnimationFrame(() => this.applyTransform());
  }
}
