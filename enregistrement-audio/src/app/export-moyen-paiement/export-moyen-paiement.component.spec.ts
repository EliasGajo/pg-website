import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportMoyenPaiementComponent } from './export-moyen-paiement.component';

describe('ExportMoyenPaiementComponent', () => {
  let component: ExportMoyenPaiementComponent;
  let fixture: ComponentFixture<ExportMoyenPaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportMoyenPaiementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportMoyenPaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
