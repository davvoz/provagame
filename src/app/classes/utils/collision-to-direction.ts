import { direzione } from "./costants.enum";

export class CollisionToDirection {
    isColliding: boolean = false;
    collisionFromRight: number = 0;
    collisionFromLeft: number = 0;
    collisionFromTop: number = 0;
    collisionFromBottom: number = 0;
    getBetterDirection(): direzione {
        let winDirctionLR = 0;
        let direzioneLR: direzione;
        if (this.collisionFromRight > this.collisionFromLeft) {
            winDirctionLR = this.collisionFromRight;
            direzioneLR = 'RIGHT';
        } else {
            winDirctionLR = this.collisionFromLeft;
            direzioneLR = 'LEFT';
        }
        let winDirctionBT = 0;
        let direzioneBT: direzione;
        if (this.collisionFromTop > this.collisionFromBottom) {
            winDirctionBT = this.collisionFromTop;
            direzioneBT = 'TOP';
        } else {
            winDirctionBT = this.collisionFromBottom;
            direzioneBT = 'BOTTOM';
        }
        if (winDirctionBT > winDirctionLR) {
            return direzioneBT;
        }
        return direzioneLR;
    }
}
