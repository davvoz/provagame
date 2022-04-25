import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleGameComponent } from './double-game.component';

describe('DoubleGameComponent', () => {
  let component: DoubleGameComponent;
  let fixture: ComponentFixture<DoubleGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoubleGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoubleGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
