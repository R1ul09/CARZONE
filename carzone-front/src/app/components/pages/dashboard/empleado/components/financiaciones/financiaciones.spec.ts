import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Financiaciones } from './financiaciones';

describe('Financiaciones', () => {
  let component: Financiaciones;
  let fixture: ComponentFixture<Financiaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Financiaciones],
    }).compileComponents();

    fixture = TestBed.createComponent(Financiaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
