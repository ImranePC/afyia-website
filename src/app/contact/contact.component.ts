import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { faEnvelope, faComment, faLocationDot, faPaperPlane, faBox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import ScrollReveal from 'scrollreveal';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterComponent, FontAwesomeModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  faPaperPlane = faPaperPlane;

  faLocationDot = faLocationDot;

  faEnvelope = faEnvelope;

  faComment = faComment;

  faBoxOpen = faBox;

  ngOnInit(): void {
    const config = {
      duration: 750,
      distance: '30px',
      origin: 'top',
    }

    ScrollReveal().reveal('.reveal', config);
  }
}
