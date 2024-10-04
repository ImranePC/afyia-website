import { Component, OnInit } from '@angular/core';
import { faEnvelope, faComment, faLocationDot, faPaperPlane, faBox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  faPaperPlane = faPaperPlane;

  faLocationDot = faLocationDot;

  faEnvelope = faEnvelope;

  faComment = faComment;

  faBoxOpen = faBox;

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.appService.initScrollReveal();
  }
}
