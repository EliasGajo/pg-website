import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnqueteVacantsComponent } from './enquete-vacants.component';

describe('EnqueteVacantsComponent', () => {
  let component: EnqueteVacantsComponent;
  let fixture: ComponentFixture<EnqueteVacantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnqueteVacantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnqueteVacantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
