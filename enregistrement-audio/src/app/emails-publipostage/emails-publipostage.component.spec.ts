import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsPublipostageComponent } from './emails-publipostage.component';

describe('EmailsPublipostageComponent', () => {
  let component: EmailsPublipostageComponent;
  let fixture: ComponentFixture<EmailsPublipostageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailsPublipostageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailsPublipostageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
