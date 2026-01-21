import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportEmailComponent } from './export-email.component';

describe('ExportEmailComponent', () => {
  let component: ExportEmailComponent;
  let fixture: ComponentFixture<ExportEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
