import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Financiacion } from './financiacion';

describe('Financiacion', () => {
  let component: Financiacion;
  let fixture: ComponentFixture<Financiacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Financiacion],
    }).compileComponents();

    fixture = TestBed.createComponent(Financiacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
