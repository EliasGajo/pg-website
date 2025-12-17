import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemplirExcelContentieuxComponent } from './remplir-excel-contentieux.component';

describe('RemplirExcelContentieuxComponent', () => {
  let component: RemplirExcelContentieuxComponent;
  let fixture: ComponentFixture<RemplirExcelContentieuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemplirExcelContentieuxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemplirExcelContentieuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
