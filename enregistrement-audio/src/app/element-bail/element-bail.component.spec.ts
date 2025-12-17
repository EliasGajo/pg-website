import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementBailComponent } from './element-bail.component';

describe('ElementBailComponent', () => {
  let component: ElementBailComponent;
  let fixture: ComponentFixture<ElementBailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementBailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementBailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
