import { TestBed } from "@angular/core/testing";
import { AppComponent } from "src/app/app.component";
import { SquareConfig } from "../utils/costants.enum";
import { Utilities } from "../utils/utilities";
import { Mago } from "./mago";

describe('Mago', () => {
    it('should create an instance', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        const context = app.ctx;
      expect(new Mago(Utilities.getSquareConfig(context,''))).toBeTruthy();
    });
});
