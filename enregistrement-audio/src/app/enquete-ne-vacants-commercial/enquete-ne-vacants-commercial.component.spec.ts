import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteNeVacantsCommercialComponent } from './enquete-ne-vacants-commercial.component';

describe('EnqueteNeVacantsCommercialComponent', () => {
  let component: EnqueteNeVacantsCommercialComponent;
  let fixture: ComponentFixture<EnqueteNeVacantsCommercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnqueteNeVacantsCommercialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnqueteNeVacantsCommercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
