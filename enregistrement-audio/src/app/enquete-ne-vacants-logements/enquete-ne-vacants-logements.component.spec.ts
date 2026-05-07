import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteNeVacantsLogementsComponent } from './enquete-ne-vacants-logements.component';

describe('EnqueteNeVacantsLogementsComponent', () => {
  let component: EnqueteNeVacantsLogementsComponent;
  let fixture: ComponentFixture<EnqueteNeVacantsLogementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnqueteNeVacantsLogementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnqueteNeVacantsLogementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
