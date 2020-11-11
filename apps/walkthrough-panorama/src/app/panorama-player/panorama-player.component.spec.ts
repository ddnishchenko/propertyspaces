import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanoramaPlayerComponent } from './panorama-player.component';

describe('PanoramaPlayerComponent', () => {
  let component: PanoramaPlayerComponent;
  let fixture: ComponentFixture<PanoramaPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanoramaPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanoramaPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
