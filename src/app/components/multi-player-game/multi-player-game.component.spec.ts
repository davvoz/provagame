import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiPlayerGameComponent } from './multi-player-game.component';

describe('MultiPlayerGameComponent', () => {
  let component: MultiPlayerGameComponent;
  let fixture: ComponentFixture<MultiPlayerGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiPlayerGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiPlayerGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
