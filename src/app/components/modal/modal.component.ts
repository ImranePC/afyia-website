import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  @Input()
  show = false;

  @Input()
  size: 'auto' | 'lg' = 'auto';

  @Output()
  onClose: EventEmitter<any> = new EventEmitter();

  faXmark = faXmark;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement);
  }

  public open(): void {
    this.show = true;
  }

  public close(): void {
    this.show = false;

    this.onClose.emit(null);
  }
}
