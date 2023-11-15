export interface TourExecution {
    id?:Number,
    TouristId: number,
    tourId: Number,
    StartTime: Date,
    EndTime?: Date,
    Completed: Boolean,
    Abandoned: Boolean,
    CurrentLatitude: Number,
    CurrentLongitude: Number,
    LastActivity: Date,
    visitedCheckpoints : number[] ,
    touristDistance: Number,
}