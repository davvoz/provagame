import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Charter } from './classes/abstract/charter';
import { Mago } from './classes/charters/mago';
import { SquareConfig } from './classes/utils/costants.enum';
import { Utilities } from './classes/utils/utilities';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'game2k22'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('game2k22');
  });

  it(`should create a charter'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const context = app.ctx;
    const configurazione: SquareConfig = Utilities.getSquareConfig(context,'');
    app.player = new Charter(configurazione);
    expect(app.player).toBeInstanceOf(Charter);
  });

  it(`should create a mago'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const context = app.ctx;
    const configurazione: SquareConfig = Utilities.getSquareConfig(context,'');
    app.player = new Mago(configurazione);
    expect(app.player).toBeInstanceOf(Mago);
  });
  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.content span')?.textContent).toContain('game2k22 app is running!');
  // });
});
