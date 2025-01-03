import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppService } from '../../services/app.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
 } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { faPaperPlane, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ArianeComponent, Path } from '../../ariane/ariane.component';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-request-account',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CommonModule,
    ArianeComponent,
    ModalComponent,
  ],
  templateUrl: './request-account.component.html',
  styleUrl: './request-account.component.scss'
})
export class RequestAccountComponent implements OnInit {
  @ViewChild('validModal')
  validModal: ModalComponent;

  @ViewChild('errorModal')
  errorModal: ModalComponent;

  faPlus = faPlus;

  faPaperPlane = faPaperPlane;

  faTimes = faTimes;

  contactForm: FormGroup;

  thermocyclerList: string[] = undefined;

  navigationPath: Path[] = [
    { name: 'header.technology', link: '/technology' },
    { name: 'software.account_request.title', link: '/account-request' },
  ]

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private api: ApiService,
  ) {
    this.contactForm = this.fb.group({
      accounts: this.fb.array([
        this.fb.group({
          lastname: ['', Validators.required],
          firstname: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
        })
      ]),
      email: ['', [Validators.required, Validators.email]],
      purchaseNumber: ['', Validators.required],
      thermocyclers: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.appService.initScrollReveal();
    this.api.getAvailableThermocycler().subscribe((data) => {
      this.thermocyclerList = data;
    })
  }

  addAccount(): void {
    (this.contactForm.get('accounts') as FormArray).push(this.fb.group({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    }));
  }

  removeAccount(index: number): void {
    this.accounts.removeAt(index);
  }

  isFieldInvalid(path: string): boolean {
    const control = this.contactForm.get(path);
    return control ? control.invalid && control.touched : false;
  }

  onCheckboxChange(event: Event, thermocycler: string): void {
    const checkbox = event.target as HTMLInputElement;
    const selectedOptions = this.selectedThermocyclers;

    if (checkbox.checked) {
      selectedOptions.push(this.fb.control(thermocycler));
    } else {
      const index = selectedOptions.controls.findIndex((control: AbstractControl) => control.value === thermocycler);
      if (index !== -1) {
        selectedOptions.removeAt(index);
      }
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.api.sendSoftwareRequest(this.contactForm.value).subscribe({
        next: () => {
          this.contactForm.reset();
          (this.contactForm.get('thermocyclers') as FormArray).clear();

          this.validModal.open();
        }, error: () => {
          this.errorModal.open();
        }
      });
    }
  }

  isThermocyclerSelected(thermocycler: string): boolean {
    const formArray = this.contactForm.get('thermocyclers') as FormArray;
    return formArray.controls.some(control => control.value === thermocycler);
  }

  get selectedThermocyclers(): FormArray {
    return this.contactForm.get('thermocyclers') as FormArray;
  }

  get accounts(): FormArray {
    return this.contactForm.get('accounts') as FormArray;
  }
}
