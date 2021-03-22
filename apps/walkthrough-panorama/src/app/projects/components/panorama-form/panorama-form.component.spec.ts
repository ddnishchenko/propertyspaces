import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanoramaFormComponent } from './panorama-form.component';

describe('PanoramaFormComponent', () => {
  let component: PanoramaFormComponent;
  let fixture: ComponentFixture<PanoramaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanoramaFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanoramaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
