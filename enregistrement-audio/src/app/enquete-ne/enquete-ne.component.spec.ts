import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteNEComponent } from './enquete-ne.component';

describe('EnqueteNEComponent', () => {
  let component: EnqueteNEComponent;
  let fixture: ComponentFixture<EnqueteNEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnqueteNEComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnqueteNEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
