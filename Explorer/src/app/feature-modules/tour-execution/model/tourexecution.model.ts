export interface TourExecution {
    id?:Number,
    TouristId: Number,
    tourId: Number,
    StartTime: Date,
    EndTime?: Date,
    Completed: Boolean,
    Abandoned: Boolean,
    CurrentLatitude: Number,
    CurrentLongitude: Number,
    LastActivity: Date,
}