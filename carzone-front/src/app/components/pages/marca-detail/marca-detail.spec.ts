import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcaDetail } from './marca-detail';

describe('MarcaDetail', () => {
  let component: MarcaDetail;
  let fixture: ComponentFixture<MarcaDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcaDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(MarcaDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
