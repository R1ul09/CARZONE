import { TestBed } from '@angular/core/testing';

import { Coche } from './coche';

describe('Coche', () => {
  let service: Coche;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Coche);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
