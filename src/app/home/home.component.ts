import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import ScrollReveal from 'scrollreveal';
import { ParallaxDirective } from '../directives/parallax.directive';
import { CardLinkComponent } from './card-link/card-link.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, ParallaxDirective, CardLinkComponent, FooterComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentStep: any = null;

  previousStep: any = null;

  ngOnInit(): void {
    const config = {
      duration: 750,
      distance: '30px',
      origin: 'top',
    }

    ScrollReveal().reveal('.reveal', config);

    const mark1 = document.getElementById('mark_1');
    const mark2 = document.getElementById('mark_2');

    ///

    const step1 = document.getElementById('step_1');
    const step2 = document.getElementById('step_2');
    const step3 = document.getElementById('step_3');
    const step4 = document.getElementById('step_4');
    const approachTitle = document.getElementById('approach_title');
    // const approachSection = document.getElementById('approach_section');

    const approachSection = document.getElementById('section_approach');

    const cardA = document.getElementById('a_card');
    const cardB = document.getElementById('b_card');
    const cardC = document.getElementById('c_card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'mark_1') {
            approachSection.style.transform = 'scale(1)';
            approachSection.style.opacity = '1';
            approachSection.style.filter = 'grayscale(0%)';

            approachTitle.style.opacity = '1';
            approachTitle.classList.remove('-translate-y-20');
            approachTitle.classList.add('-translate-y-10');
          }
        } else {
          if (entry.target.id === 'mark_1') {
            approachSection.style.transform = 'scale(0.9)';
            approachSection.style.opacity = '0.5';
            approachSection.style.filter = 'grayscale(50%)';

            approachTitle.style.opacity = '0';
            approachTitle.classList.remove('-translate-y-10');
            approachTitle.classList.add('-translate-y-20');
          }
        }
      });
    }, {
      root: null,
      threshold: 0,
    });

    // const observer = new IntersectionObserver((entries) => {
    //   entries.forEach((entry) => {
    //     if (entry.isIntersecting) {
    //       if (entry.target.id === 'step_1') {
    //         this.hideCard(cardB);
    //         this.showCard(cardA);

    //         this.updateStep('step_1');
    //       }

    //       if (entry.target.id === 'step_2') {
    //         this.hideCard(cardA);
    //         this.hideCard(cardC);
    //         this.showCard(cardB);

    //         this.updateStep('step_2');
    //       }

    //       if (entry.target.id === 'step_3') {
    //         this.hideCard(cardB);
    //         this.showCard(cardC);

    //         approachSection.classList.add('hide');
    //         document.body.classList.remove('bg-dark-gradient');

    //         this.updateStep('step_3');
    //       }

    //       if (entry.target.id === 'step_4') {
    //         this.hideCard(cardC);
    //         this.updateStep('step_4');

    //         approachSection.classList.remove('hide');
    //         approachSection.classList.remove('inactive');

    //         document.body.classList.add('bg-dark-gradient');
    //       }

    //       if (entry.target.id === 'approach_title' && this.currentStep === 'step_4') {
    //         document.body.classList.add('bg-dark-gradient');
    //         approachSection.classList.remove('inactive');
    //       }
    //     } else {
    //       if (entry.target.id === 'approach_title') {
    //         document.body.classList.remove('bg-dark-gradient');
    //         approachSection.classList.add('inactive');
    //       }
    //     }
    //   });
    // }, {
    //   root: null,
    //   threshold: 0,
    // });

    observer.observe(mark1);
    observer.observe(mark2);

    observer.observe(step1);
    observer.observe(step2);
    observer.observe(step3);
    observer.observe(step4);
    observer.observe(approachTitle);
  }

  showCard(element: HTMLElement) {
    element.style.opacity = '1';
  }

  hideCard(element: HTMLElement) {
    element.style.opacity = '0';
  }

  updateStep(step: string): void {
    this.previousStep = this.currentStep;
    this.currentStep = step;
  }
}
