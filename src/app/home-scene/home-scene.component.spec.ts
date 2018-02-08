import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSceneComponent } from './home-scene.component';

describe('HomeSceneComponent', () => {
  let component: HomeSceneComponent;
  let fixture: ComponentFixture<HomeSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
