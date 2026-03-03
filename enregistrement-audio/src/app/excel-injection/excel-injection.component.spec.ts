import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelInjectionComponent } from './excel-injection.component';

describe('ExcelInjectionComponent', () => {
  let component: ExcelInjectionComponent;
  let fixture: ComponentFixture<ExcelInjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelInjectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelInjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
