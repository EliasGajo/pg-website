import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunusComponent } from './comunus.component';

describe('ComunusComponent', () => {
  let component: ComunusComponent;
  let fixture: ComponentFixture<ComunusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
