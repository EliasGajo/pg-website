import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunusSinistresComponent } from './comunus-sinistres.component';

describe('ComunusSinistresComponent', () => {
  let component: ComunusSinistresComponent;
  let fixture: ComponentFixture<ComunusSinistresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunusSinistresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunusSinistresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
