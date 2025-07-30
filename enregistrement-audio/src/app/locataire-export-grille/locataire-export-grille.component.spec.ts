import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocataireExportGrilleComponent } from './locataire-export-grille.component';

describe('LocataireExportGrilleComponent', () => {
  let component: LocataireExportGrilleComponent;
  let fixture: ComponentFixture<LocataireExportGrilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocataireExportGrilleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocataireExportGrilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
