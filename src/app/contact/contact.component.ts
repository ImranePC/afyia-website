import { Component, OnInit } from '@angular/core';
import {
  faEnvelope,
  faComment,
  faLocationDot,
  faPaperPlane,
  faBox,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../services/app.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule, CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  faPaperPlane = faPaperPlane;

  faLocationDot = faLocationDot;

  faEnvelope = faEnvelope;

  faComment = faComment;

  faBoxOpen = faBox;

  faCircleQuestion = faCircleQuestion;

  selectedSubject: 'command' | 'question' | 'other' | undefined = undefined;

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
      this.api.sendMessage(this.messageForm.value).subscribe((data) => {
        this.messageForm.reset({
          subject: this.selectedSubject,
        });
      });
    }
  }
}
