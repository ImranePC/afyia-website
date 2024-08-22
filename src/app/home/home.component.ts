import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import ScrollReveal from 'scrollreveal';
import { ParallaxDirective } from '../directives/parallax.directive';
import { CardLinkComponent } from './card-link/card-link.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, ParallaxDirective, CardLinkComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    const config = {
      duration: 750,
      distance: '30px',
      easing: 'ease-out',
      origin: 'top',
    }

    ScrollReveal().reveal('.reveal', config);

    const stickyWrapper = document.getElementById('sticky-wrapper');
    const stickyElement = document.getElementById('sticky-element');
    const step1 = document.getElementById('step_1');
    const step2 = document.getElementById('step_2');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'step_1') {
            document.getElementById('b_card')!.style.opacity = '1';
            document.getElementById('b_card')!.classList.remove('translate-y-1');
            document.getElementById('b_card')!.style.transform = 'translateY(0)';
          }

          if (entry.target.id === 'step_2') {
            document.getElementById('c_card')!.style.opacity = '1';
            document.getElementById('c_card')!.style.transform = 'translateY(0)';
          }
        } else {
          if (entry.target.id === 'step_1') {
            document.getElementById('b_card')!.style.opacity = '0';
            document.getElementById('b_card')!.style.transform = 'translateY(2rem)';
          }

          if (entry.target.id === 'step_2') {
            document.getElementById('c_card')!.style.opacity = '0';
            document.getElementById('c_card')!.style.transform = 'translateY(2rem)';
          }
        }
      });
    }, {
      root: null,
      threshold: 0,
    });

    observer.observe(step1 as HTMLElement);
    observer.observe(step2 as HTMLElement);

    // const elements = [
    //   document.getElementById('step_1'),
    //   document.getElementById('step_2'),
    //   document.getElementById('step_3'),
    //   document.getElementById('step_4'),
    // ]

    // document.addEventListener('scroll', function() {
    //   // Get the element with id '1'
    //   var targetElement = document.getElementById('step_1');

    //   // Get the position of the element relative to the viewport
    //   var elementPosition = targetElement!.getBoundingClientRect();

    //   // Check if the element is within the viewport (or at least at the top)
    //   if (elementPosition.top <= 0 && elementPosition.bottom >= 0) {
    //       // Change background to dark
    //       document.body.style.backgroundColor = 'black';
    //   }
    // });
  }
}
