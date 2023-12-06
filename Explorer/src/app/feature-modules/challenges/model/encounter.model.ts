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
    peopleCount: number;
    range: number;
    image: string;
}


enum encounterStatus{
    Active,
    Draft,
    Archived
}

enum encounterType{
    Social,
    Location,
    Misc
}

export interface ActiveEncounter {
    id?: number;
    encounterId : string;
    touristId: string;
    state:number;
    end: Date
}

export interface EncounterMapMaterial {
    encounterId?:number;
    lat:number;
    lng:number;
    activeCount:number,
    isActive:Boolean
}