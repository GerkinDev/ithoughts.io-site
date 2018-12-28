import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TilerComponent } from './tiler.component';

describe('TilerComponent', () => {
  let component: TilerComponent;
  let fixture: ComponentFixture<TilerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TilerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
