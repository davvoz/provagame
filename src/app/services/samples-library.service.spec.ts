import { TestBed } from '@angular/core/testing';

import { SamplesLibraryService } from './samples-library.service';

describe('SamplesLibraryService', () => {
  let service: SamplesLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SamplesLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
