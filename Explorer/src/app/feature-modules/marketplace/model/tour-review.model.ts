export interface TourReview {
    id?: number;
    grade: number;
    comment: string;
    images: string;
    userId: number;
    reviewDate: Date;
    tourId: number;
}