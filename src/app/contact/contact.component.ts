import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  faEnvelope,
  faComment,
  faLocationDot,
  faPaperPlane,
  faBox,
  faCircleQuestion,
  faUserTie,
  faTruckFast,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../services/app.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule, CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  @ViewChild('validModal')
  validModal: ModalComponent;

  @ViewChild('errorModal')
  errorModal: ModalComponent;

  faPaperPlane = faPaperPlane;

  faLocationDot = faLocationDot;

  faEnvelope = faEnvelope;

  faComment = faComment;

  faTruckFast = faTruckFast;

  faUserTie = faUserTie;

  faCircleQuestion = faCircleQuestion;

  selectedSubject: 'command' | 'question' | 'hire' | 'other' | undefined = undefined;

  messageForm: FormGroup;

  constructor(private appService: AppService, private fb: FormBuilder, private api: ApiService) {
    this.messageForm = this.fb.group({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      subject: [undefined, Validators.required],
    })
  }

  ngOnInit(): void {
    this.appService.initScrollReveal();
  }

  setSelectedSubject(subject: any): void {
    this.selectedSubject = subject;
    this.messageForm.get('subject').setValue(subject);
  }

  onSubmit() {
    if (this.messageForm.valid) {
      this.api.sendMessage(this.messageForm.value).subscribe({
        next: () => {
          this.messageForm.reset({
            subject: this.selectedSubject,
          });

          this.validModal.open();
        }, error: () => {
          this.errorModal.open();
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    return this.messageForm.get(field)?.invalid && this.messageForm.get(field)?.touched
  }
}
