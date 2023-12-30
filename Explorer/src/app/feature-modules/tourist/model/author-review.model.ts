export interface AuthorReview {
    id:number;
    grade: number;
    comment: number;
    authorId: number;
    reviewDate: Date;
    touristId: number;
    isApproved: boolean;
}