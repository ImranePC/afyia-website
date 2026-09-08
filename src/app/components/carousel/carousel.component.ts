import {
  afterNextRender,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const CARD_WIDTH = 500;
const CARD_GAP = 16; // gap-4
const STEP = CARD_WIDTH + CARD_GAP;
export interface CarouselElement {
  title: string;
  image: string;
  route: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [TranslateModule, FontAwesomeModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnDestroy {
  @ViewChild('viewport')
  private viewportRef!: ElementRef<HTMLDivElement>;

  @ViewChild('track')
  private trackRef!: ElementRef<HTMLDivElement>;

  @Input()
  items: CarouselElement[] = [];

  translateX = signal(0);

  maxScroll = signal(0);

  isDragging = signal(false);

  private resizeObserver?: ResizeObserver;

  private drag: { pointerId: number; startX: number; startTranslate: number; moved: boolean } | null = null;

  private lastDragMoved = false;

  faChevronLeft = faChevronLeft;

  faChevronRight = faChevronRight;

  constructor(public translate: TranslateService, private router: Router) {
    afterNextRender(() => {
      this.updateMaxScroll();

      this.resizeObserver = new ResizeObserver(() => this.updateMaxScroll());
      this.resizeObserver.observe(this.viewportRef.nativeElement);
      this.resizeObserver.observe(this.trackRef.nativeElement);
    });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  previous() {
    this.translateX.update((x) => Math.min(0, x + STEP));
  }

  next() {
    this.translateX.update((x) => Math.max(-this.maxScroll(), x - STEP));
  }

  onPointerDown(event: PointerEvent) {
    this.drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTranslate: this.translateX(),
      moved: false,
    };
    this.isDragging.set(true);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent) {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return;

    const delta = event.clientX - this.drag.startX;
    if (Math.abs(delta) > 3) this.drag.moved = true;

    const next = this.drag.startTranslate + delta;
    this.translateX.set(Math.max(-this.maxScroll(), Math.min(0, next)));
  }

  onPointerUp(event: PointerEvent) {
    if (!this.drag || event.pointerId !== this.drag.pointerId) return;

    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
    this.isDragging.set(false);
    this.lastDragMoved = this.drag.moved;
    this.drag = null;
  }

  onTrackClick(event: MouseEvent) {
    if (this.lastDragMoved) {
      event.preventDefault();
      event.stopPropagation();
      this.lastDragMoved = false;
      return;
    }

    // setPointerCapture on the viewport (used for drag tracking) retargets the
    // resulting click event to the viewport itself instead of the element the
    // pointer is actually over, so routerLink on descendants never receives it.
    const target = (event.target === event.currentTarget
      ? document.elementFromPoint(event.clientX, event.clientY)
      : event.target) as HTMLElement | null;

    const routable = target?.closest<HTMLElement>('[data-route]');
    const route = routable?.dataset['route'];
    if (route) this.router.navigate(['/', this.translate.currentLang, route]);
  }

  private updateMaxScroll() {
    const viewportWidth = this.viewportRef.nativeElement.clientWidth;
    const trackWidth = this.trackRef.nativeElement.scrollWidth;
    const max = Math.max(0, trackWidth - viewportWidth);

    this.maxScroll.set(max);
    this.translateX.update((x) => Math.max(-max, Math.min(0, x)));
  }
}
