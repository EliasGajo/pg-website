import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDiversDebiteurComponent } from './export-divers-debiteur.component';

describe('ExportDiversDebiteurComponent', () => {
  let component: ExportDiversDebiteurComponent;
  let fixture: ComponentFixture<ExportDiversDebiteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportDiversDebiteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportDiversDebiteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
