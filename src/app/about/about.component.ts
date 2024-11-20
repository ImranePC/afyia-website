import { Component, HostListener, OnInit } from '@angular/core';
import { ParallaxDirective } from '../directives/parallax.directive';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../services/app.service';
import { ArianeComponent } from '../ariane/ariane.component';
import { CtaComponent } from '../cta/cta.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ParallaxDirective, FontAwesomeModule, TranslateModule, CtaComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  timelineBar: HTMLElement;

  timelineElements: HTMLElement[];

  faQuoteLeft = faQuoteLeft;

  faQuoteRight = faQuoteRight;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();

    this.timelineElements = [
      document.getElementById('timeline_element_1'),
      document.getElementById('timeline_element_2'),
      document.getElementById('timeline_element_3'),
      document.getElementById('timeline_element_4'),
      document.getElementById('timeline_element_5'),
    ];

    this.timelineBar = document.getElementById('timeline_progress');
  }

  @HostListener('window:scroll')
  onScroll() {
    const cursorRect = this.timelineBar.getBoundingClientRect();

    this.timelineElements.forEach((item: any) => {
      const itemRect = item.getBoundingClientRect();

      // 12px margin to make element active on the dot
      if (cursorRect.bottom >= (itemRect.top + 12)) {
        item.classList.remove('inactive');
      } else {
        if (!item.classList.contains('inactive')) {
          item.classList.add('inactive');
        }
      }
    })
  }
}
