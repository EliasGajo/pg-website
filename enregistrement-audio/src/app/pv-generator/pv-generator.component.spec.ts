import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvGeneratorComponent } from './pv-generator.component';

describe('PvGeneratorComponent', () => {
  let component: PvGeneratorComponent;
  let fixture: ComponentFixture<PvGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PvGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PvGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
