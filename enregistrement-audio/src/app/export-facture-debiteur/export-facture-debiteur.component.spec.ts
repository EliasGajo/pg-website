import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFactureDebiteurComponent } from './export-facture-debiteur.component';

describe('ExportFactureDebiteurComponent', () => {
  let component: ExportFactureDebiteurComponent;
  let fixture: ComponentFixture<ExportFactureDebiteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportFactureDebiteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportFactureDebiteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
