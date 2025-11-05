import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationExcelComponent } from './modification-excel.component';

describe('ModificationExcelComponent', () => {
  let component: ModificationExcelComponent;
  let fixture: ComponentFixture<ModificationExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationExcelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificationExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
