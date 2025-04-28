import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCoproprietaireComponent } from './export-coproprietaire.component';

describe('ExportCoproprietaireComponent', () => {
  let component: ExportCoproprietaireComponent;
  let fixture: ComponentFixture<ExportCoproprietaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportCoproprietaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportCoproprietaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
