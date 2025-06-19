import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportProprietaireComponent } from './export-proprietaire.component';

describe('ExportProprietaireComponent', () => {
  let component: ExportProprietaireComponent;
  let fixture: ComponentFixture<ExportProprietaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportProprietaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportProprietaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
