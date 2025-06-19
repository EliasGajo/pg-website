import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLocataireComponent } from './export-locataire.component';

describe('ExportLocataireComponent', () => {
  let component: ExportLocataireComponent;
  let fixture: ComponentFixture<ExportLocataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportLocataireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportLocataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
