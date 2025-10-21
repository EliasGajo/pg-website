import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportEtatLocatifComponent } from './export-etat-locatif.component';

describe('ExportEtatLocatifComponent', () => {
  let component: ExportEtatLocatifComponent;
  let fixture: ComponentFixture<ExportEtatLocatifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportEtatLocatifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportEtatLocatifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
