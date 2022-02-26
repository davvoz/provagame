import { Muro } from "./muro";

export class Mura {
    private muri: Muro[] = [];
    getMuri() {
        return this.muri;
    }
    setMuri(muri: Muro[]) {
        this.muri = muri;
    }
    drawMura() {
        for (let i = 0; i < this.muri.length; i++) {
            this.muri[i].draw();    
        }
    }
}