export interface Encounter {
    id?: number;
    name : string;
    description: string;
    latitude : number;
    longitude : number;
    xp : number;
    status : encounterStatus;
    type : encounterType;
    mandatory: boolean;
    peopleCount: number | null;
    range: number | null;
    image: string | null;
}

export enum encounterStatus{
    Active,
    Draft,
    Archived
}

export enum encounterType{
    Social,
    Location,
    Misc
}