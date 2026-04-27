import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareLinkCardComponent } from './software-link-card.component';

describe('SoftwareLinkCardComponent', () => {
  let component: SoftwareLinkCardComponent;
  let fixture: ComponentFixture<SoftwareLinkCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoftwareLinkCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoftwareLinkCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
