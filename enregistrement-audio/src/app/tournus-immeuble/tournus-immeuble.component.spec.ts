import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournusImmeubleComponent } from './tournus-immeuble.component';

describe('TournusImmeubleComponent', () => {
  let component: TournusImmeubleComponent;
  let fixture: ComponentFixture<TournusImmeubleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournusImmeubleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournusImmeubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
