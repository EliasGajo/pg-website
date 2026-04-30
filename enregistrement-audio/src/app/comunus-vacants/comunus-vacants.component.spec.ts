import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunusVacantsComponent } from './comunus-vacants.component';

describe('ComunusVacantsComponent', () => {
  let component: ComunusVacantsComponent;
  let fixture: ComponentFixture<ComunusVacantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComunusVacantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunusVacantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
