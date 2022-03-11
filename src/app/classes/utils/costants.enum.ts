import { GeneralSprite } from "../elements/general-sprite";

export type classe = 'MAGO' | 'GUERRIERO' | 'ARCERE' | 'SAMURAI' | 'ABSTRACT' | 'BULLO';
export type classeProiettile = 'PALLADIFUOCO' | 'RAGNO' | 'EDWARD' | 'HAMMER' | 'ABSTRACT';

export type tipoBonus = 'salute' | 'forza' | 'intelligenza';
export type direzione = 'TOP' | 'BOTTOM' | 'RIGHT' | 'LEFT' | 'STAND';
export type malus = 'STUN' | 'VENO' | 'FIRE' | 'BLOCK';
export interface MaliciusEffect {
    malus: malus;
    value: boolean;
    quantita: number;
    totTurni: number
}
export interface Malefici {
    stunned: MaliciusEffect;
    poisoned: MaliciusEffect;
    fiery: MaliciusEffect;
    blocked: MaliciusEffect;
}
export type stato = 'attaccando' | 'difendendo' | 'camminando' | 'morendo';
export interface FinalState {
    money: number;
    livelloSchema: number;
    livelloPersonaggio: number;
    classe: classe;
    numeroSchivate: number;
    numeroAttacchi: number;
    ratio: number
}
export type statoBottone = 'ON' | 'OFF';
export type tipoSfondo = 'NOTTE' | 'GIORNO';
export interface MondoConfigurations {
    livelloNemici: number;
    numeroNemici: number;
    velocitaCamion: number;
    id: number
}
export interface DrawSquareParam {
    x: number;
    y: number;
    sideX: number;
    sideY: number
}
export interface IOtherAnimations {
    lanciaOggetto(sprite: GeneralSprite): any;
}
export interface Visione {
    originX: number;
    originY: number;
}
export interface ParametriFanatsy {
    salute: number;
    forza: number;
    intelligenza: number;
    agilita: number;
    resistenzaMagica: number;
    resistenzaFisica: number;
    mana: number;
    maxMana: number;
    numeriFortunati: number[];
    livello: number;
    money: number
}
export interface CharterParam {
    parametriFantasy: ParametriFanatsy;
    sintesiDati: SintesiDati;
    malefici: Malefici
}
export interface SintesiDati {
    danniMagiciRicevuti: number;
    danniFisiciRicevuti: number;
    dannoCritico: number;
    danniCriticiInflitti: number;
    danniCriticiRicevuti: number;
    numeroSchivate: number;
    numeroAttacchi: number;
}
export interface SquareConfig {
    x: number;
    y: number;
    h: number;
    w: number;
    ctx: CanvasRenderingContext2D;
    color: string;
    velocita: number;
}