import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteNeObjetsCommercialComponent } from './enquete-ne-objets-commercial.component';

describe('EnqueteNeObjetsCommercialComponent', () => {
  let component: EnqueteNeObjetsCommercialComponent;
  let fixture: ComponentFixture<EnqueteNeObjetsCommercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnqueteNeObjetsCommercialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnqueteNeObjetsCommercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
