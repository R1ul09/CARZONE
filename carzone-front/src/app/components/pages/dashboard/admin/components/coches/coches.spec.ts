import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coches } from './coches';

describe('Coches', () => {
  let component: Coches;
  let fixture: ComponentFixture<Coches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coches],
    }).compileComponents();

    fixture = TestBed.createComponent(Coches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
