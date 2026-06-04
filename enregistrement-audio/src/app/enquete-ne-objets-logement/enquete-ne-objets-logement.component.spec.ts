import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteNeObjetsLogementComponent } from './enquete-ne-objets-logement.component';

describe('EnqueteNeObjetsLogementComponent', () => {
  let component: EnqueteNeObjetsLogementComponent;
  let fixture: ComponentFixture<EnqueteNeObjetsLogementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnqueteNeObjetsLogementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnqueteNeObjetsLogementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
