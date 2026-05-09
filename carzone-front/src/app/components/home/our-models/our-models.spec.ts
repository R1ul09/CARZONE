import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurModels } from './our-models';

describe('OurModels', () => {
  let component: OurModels;
  let fixture: ComponentFixture<OurModels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurModels],
    }).compileComponents();

    fixture = TestBed.createComponent(OurModels);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
