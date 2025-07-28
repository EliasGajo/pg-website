import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrMultipleComponent } from './qr-multiple.component';

describe('QrMultipleComponent', () => {
  let component: QrMultipleComponent;
  let fixture: ComponentFixture<QrMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrMultipleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
