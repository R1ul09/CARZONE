import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocheDetail } from './coche-detail';

describe('CocheDetail', () => {
  let component: CocheDetail;
  let fixture: ComponentFixture<CocheDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocheDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(CocheDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
