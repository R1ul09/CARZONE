import { TestBed } from '@angular/core/testing';

import { Financiacion } from './financiacion';

describe('Financiacion', () => {
  let service: Financiacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Financiacion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
