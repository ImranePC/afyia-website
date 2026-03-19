import { Component, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ModalComponent } from '../modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-newsletter-button',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    ModalComponent,
    FontAwesomeModule,
  ],
  templateUrl: './newsletter-button.component.html',
  styleUrl: './newsletter-button.component.scss'
})
export class NewsletterButtonComponent {
  @ViewChild('newsletterModal')
  newsletterModal: ModalComponent;

  @ViewChild('newsletterErrorModal')
  newsletterErrorModal: ModalComponent;

  faNewspaper = faNewspaper;

  newsletterForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.newsletterForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
    })
  }

  subscribeNewsletter(): void {
    this.apiService.subscribeToNewsletter(this.newsletterForm.value.user_email).subscribe({
      next: () => {
        this.newsletterForm.reset();
        this.newsletterModal.open();
      },
      error: (err) => {
        console.error(err);
        this.newsletterErrorModal.open();
      }
    });
  }
}
