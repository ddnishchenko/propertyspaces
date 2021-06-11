import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoModalComponent } from './contact-info-modal.component';

describe('ContactInfoModalComponent', () => {
  let component: ContactInfoModalComponent;
  let fixture: ComponentFixture<ContactInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactInfoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
