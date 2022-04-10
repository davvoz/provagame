import { Charter } from "../abstract/charter";
import { BottonePozione } from "../buttons/bottone-pozione";
import { BottoneScudoAttiva } from "../buttons/bottone-scudo-attiva";
import { Bonus } from "../elements/bonus";
import { GeneralSprite } from "../elements/general-sprite";
import { Mondo } from "../elements/mondo";
import { Proiettile } from "../elements/proiettile";

export type classe = 'MAGO' | 'GUERRIERO' | 'ARCERE' | 'SAMURAI' | 'ABSTRACT' | 'BULLO';
export type classeProiettile = 'PALLADIFUOCO' | 'RAGNO' | 'COLTELLO' | 'HAMMER' | 'ABSTRACT';
export type tipoBonus = 'salute' | 'forza' | 'intelligenza';
export type direzione = 'TOP' | 'BOTTOM' | 'RIGHT' | 'LEFT' | 'STAND';
export type malus = 'STUN' | 'VENO' | 'FIRE' | 'BLOCK' | 'BLOOD';
export type stato = 'attaccando' | 'difendendo' | 'camminando' | 'morendo';
export type statoBottone = 'ON' | 'OFF';
export type tipoSfondo = 'NOTTE' | 'GIORNO';

export enum KEY_CODE {
    UP_ARROW = 'ArrowUp',
    DOWN_ARROW = 'ArrowDown',
    RIGHT_ARROW = 'ArrowRight',
    LEFT_ARROW = 'ArrowLeft',
}

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
    slowed: MaliciusEffect;
    blooding: MaliciusEffect
}
export interface FinalState {
    money: number;
    livelloSchema: number;
    livelloPersonaggio: number;
    classe: classe;
    numeroSchivate: number;
    numeroAttacchi: number;
    ratio: number
}
export interface MondoConfigurations {
    livelloNemici: number;
    numeroNemici: number;
    velocitaCamion: number;
    id: number
}
export interface SquareParam {
    x: number;
    y: number;
    h: number;
    w: number
}
export interface GetSquareParam {
    getSquareParam(): SquareParam
}
export interface Drowable {
    draw(): void
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
export interface Coordinate {
    x: number;
    y: number
}

export interface CollisionsParams {
    mondo: Mondo,
    player: Charter,
    proiettile: Proiettile,
    mondoNumero: number,
    scudoButton: BottoneScudoAttiva,
    pozioniBottoni: BottonePozione[],
    bonus: Bonus[],
    counterAnimation: number
}

export interface Item {
    campo1: string,
    campo2: string,
    campo3: number
}

export interface TabellaPresenze {
    id: playerFirebase,
    presente: boolean
}

export interface Chates {
    speak: string,
    time: Date
}
export interface IMyUint8Array {
    byteArrayStringFormat: string
}
export type tabelleFirebase = 'raccolta' | 'tabella-presenze' | 'chates' | 'location' | 'byteArray';
export type playerFirebase = 'player-uno' | 'player-due';
export interface IMyGeolocation {
    IPv4: string
    city: string
    country_code: string
    country_name: string
    latitude: number
    longitude: number
    postal: string
    state: string
}
