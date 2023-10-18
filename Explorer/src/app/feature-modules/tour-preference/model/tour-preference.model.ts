export interface TourPreference{
    id : number,
    touristId : number,
    difficulty : number,
    walkingRating : number,
    bicycleRating : number,
    carRating : number,
    boatRating : number,
    tags : string[];
}