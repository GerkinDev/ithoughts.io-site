import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowroomElementComponent } from './showroom-element.component';

describe('ShowroomElementComponent', () => {
  let component: ShowroomElementComponent;
  let fixture: ComponentFixture<ShowroomElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowroomElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
