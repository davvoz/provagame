export type classe = 'MAGO' | 'GUERRIERO' | 'ARCERE' | 'ABSTRACT';
export type tipoBonus = 'salute' | 'forza' | 'intelligenza';
export type direzione = 'TOP' | 'BOTTOM' | 'RIGHT' | 'LEFT' | 'STAND';
export type conditionType = 'STUN' | 'VENO' | 'FIRE';
export interface Condition {
    conditionType: conditionType;
    value: boolean;
    quantita: number;
    totTurni: number
}
export interface Conditions {
    stunned: Condition;
    poisoned: Condition;
    fiery: Condition
}
export type stato = 'attaccando' | 'difendendo' | 'camminando' | 'morendo';
export interface FinalState {
    money: number;
    livelloSchema: number;
    livelloPersonaggio: number
}
export interface DrawSquareParam {
    x: number;
    y: number;
    sideX: number;
    sideY: number
}