import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  faEnvelope,
  faComment,
  faLocationDot,
  faPaperPlane,
  faCircleQuestion,
  faUserTie,
  faTruckFast,
  faComputer,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../services/app.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ModalComponent } from '../modal/modal.component';
import { ActivatedRoute } from '@angular/router';

type Subject = 'command' | 'question' | 'hire' | 'other' | 'software' | undefined;

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

  faComputer = faComputer

  selectedSubject: Subject = undefined;

  messageForm: FormGroup;

  dataConsent = false;

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
  ) {
    this.messageForm = this.fb.group({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      subject: [undefined, Validators.required],
    });
  }

  ngOnInit(): void {
    this.appService.initScrollReveal();

    this.route.queryParams.subscribe((parameters) => {
      if (this.isValidSubject(parameters['subject'])) {
        this.setSelectedSubject(parameters['subject']);
      }
    })
  }

  setSelectedSubject(subject: any): void {
    this.selectedSubject = subject;
    this.messageForm.get('subject').setValue(subject);
  }

  onSubmit() {
    if (this.messageForm.valid && this.dataConsent) {
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

  private isValidSubject(value: any): boolean {
    return ['command', 'question', 'hire', 'other', 'software'].includes(value);
  }
}
