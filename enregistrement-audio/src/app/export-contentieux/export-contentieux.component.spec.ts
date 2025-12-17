import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportContentieuxComponent } from './export-contentieux.component';

describe('ExportContentieuxComponent', () => {
  let component: ExportContentieuxComponent;
  let fixture: ComponentFixture<ExportContentieuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportContentieuxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportContentieuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
