import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ParallaxDirective } from '../directives/parallax.directive';
import { AppService } from '../services/app.service';
import { ArianeComponent, Path } from '../ariane/ariane.component';
import { faComputer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-software',
  standalone: true,
  imports: [
    TranslateModule,
    ParallaxDirective,
    ArianeComponent,
    FontAwesomeModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './software.component.html',
  styleUrl: './software.component.scss'
})
export class SoftwareComponent {
  faComputer = faComputer;

  navigationPath: Path[] = [
    { name: 'header.technology', link: '/technology' },
    { name: 'software.title', link: '/software' },
  ]

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
  }
}
