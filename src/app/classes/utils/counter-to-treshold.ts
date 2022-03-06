export class CounterToTrashold {
    counter = 0;
    private counterEnd = false;
    private isCountingActive = false;
    private treshold: number;
    private isReverseMode: boolean;
    constructor(treshold: number, isReverseMode: boolean) {
        this.isReverseMode = isReverseMode;
        this.treshold = treshold;
        this.counter = !isReverseMode ? treshold : 0;
    }
    counting() {
        if (this.isCountingActive) {
            this.isReverseMode ? this.reverseCounting() : this.normalCounting()
        };
    }
    private normalCounting() {
        if (this.counter != 0) {
            this.counter--;
            this.counterEnd = false;
        } else {
            this.counter = this.treshold;
            this.counterEnd = true;
            this.isCountingActive = false;
        }

    }
    
    private reverseCounting() {
        if (this.counter < this.treshold) {
            this.counter++;
        } else {
            this.counter = 0;
        }
    }
    attiva() {
        this.isCountingActive = true;
    }

    isActive(): boolean {
        return this.isCountingActive && !this.counterEnd;
    }
}