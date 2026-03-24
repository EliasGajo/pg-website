import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunusElComponent } from './comunus-el.component';

describe('ComunusElComponent', () => {
  let component: ComunusElComponent;
  let fixture: ComponentFixture<ComunusElComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunusElComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunusElComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
