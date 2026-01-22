import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeExcelsComponent } from './merge-excels.component';

describe('MergeExcelsComponent', () => {
  let component: MergeExcelsComponent;
  let fixture: ComponentFixture<MergeExcelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergeExcelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergeExcelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
