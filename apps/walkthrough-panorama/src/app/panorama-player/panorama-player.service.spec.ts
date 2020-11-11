import { TestBed } from '@angular/core/testing';

import { PanoramaPlayerService } from './panorama-player.service';

describe('PanoramaPlayerService', () => {
  let service: PanoramaPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PanoramaPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
