export interface Encounter {
    id?: number;
    name : string;
    description: string;
    latitude : number;
    longitude : number;
    xp : number;
    status : number;
    type : number;
    mandatory: boolean;
    peopleCount: number;
    range: number;
    image: string;
}