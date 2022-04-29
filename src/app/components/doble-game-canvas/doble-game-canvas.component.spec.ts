import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DobleGameCanvasComponent } from './doble-game-canvas.component';

describe('DobleGameCanvasComponent', () => {
  let component: DobleGameCanvasComponent;
  let fixture: ComponentFixture<DobleGameCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DobleGameCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DobleGameCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
