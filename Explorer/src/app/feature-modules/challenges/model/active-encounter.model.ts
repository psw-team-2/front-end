export interface ActiveEncounter {
    id?: number;
    encounterId : number;
    touristId: number;
    state : number;
    end : Date;
    level: number;
    xp: number;
}