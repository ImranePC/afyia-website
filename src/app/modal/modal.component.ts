import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class ModalComponent {
  @Input()
  show = false;

  @Input()
  size: 'auto' | 'lg' = 'auto';

  @Output()
  onClose: EventEmitter<any> = new EventEmitter();

  faXmark = faXmark;

  public open(): void {
    this.show = true;
  }

  public close(): void {
    this.show = false;

    this.onClose.emit(null);
  }
}
