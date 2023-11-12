export interface TourProblem {
    id?: number;
    problemCategory: string;
    problemPriority: string;
    description?: string;
    timeStamp: Date;
    tourId: number;
    isClosed: boolean;
    isResolved: boolean;
    touristId: number;
    deadlineTimeStamp?: Date;
    touristId?: number;
}