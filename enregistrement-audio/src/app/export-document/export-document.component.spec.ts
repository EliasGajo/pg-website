import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDocumentComponent } from './export-document.component';

describe('ExportDocumentComponent', () => {
  let component: ExportDocumentComponent;
  let fixture: ComponentFixture<ExportDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
