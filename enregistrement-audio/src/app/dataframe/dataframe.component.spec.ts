import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataframeComponent } from './dataframe.component';

describe('DataframeComponent', () => {
  let component: DataframeComponent;
  let fixture: ComponentFixture<DataframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataframeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
