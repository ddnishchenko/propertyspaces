import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorplanFormComponent } from './floorplan-form.component';

describe('FloorplanFormComponent', () => {
  let component: FloorplanFormComponent;
  let fixture: ComponentFixture<FloorplanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorplanFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorplanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
