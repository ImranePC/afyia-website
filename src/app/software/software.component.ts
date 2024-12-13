import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ParallaxDirective } from '../directives/parallax.directive';
import { AppService } from '../services/app.service';
import { ArianeComponent, Path } from '../ariane/ariane.component';
import { faComputer, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalComponent } from '../modal/modal.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-software',
  standalone: true,
  imports: [
    TranslateModule,
    ParallaxDirective,
    ArianeComponent,
    FontAwesomeModule,
    ModalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './software.component.html',
  styleUrl: './software.component.scss'
})
export class SoftwareComponent {
  faComputer = faComputer;

  faPaperPlane = faPaperPlane;

  contactForm: FormGroup;

  navigationPath: Path[] = [
    { name: 'header.technology', link: '/technology' },
    { name: 'software.title', link: '/software' },
  ]

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private api: ApiService,
  ) {
    this.contactForm = this.fb.group({
      lastname: ['Test', Validators.required],
      firstname: ['Test 2', Validators.required],
      email: ['test@test.com', [Validators.required, Validators.email]],
      purchaseNumber: ['FA4232D', Validators.required],
    })
  }

  ngOnInit(): void {
    this.appService.initScrollReveal();
  }

  isFieldInvalid(field: string): boolean {
    return this.contactForm.get(field)?.invalid && this.contactForm.get(field)?.touched
  }

  onSubmit() {
    // if (this.contactForm.valid) {
    //   this.api.sendSoftwareRequest(this.contactForm.value).subscribe({
    //     next: () => {

    //     }, error: () => {

    //     }
    //   });
    // }
  }
}
