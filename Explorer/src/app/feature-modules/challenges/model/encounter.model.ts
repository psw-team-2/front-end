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