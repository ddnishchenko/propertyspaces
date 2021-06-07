import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualTourComponent } from './virtual-tour.component';

describe('VirtualTourComponent', () => {
  let component: VirtualTourComponent;
  let fixture: ComponentFixture<VirtualTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualTourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
