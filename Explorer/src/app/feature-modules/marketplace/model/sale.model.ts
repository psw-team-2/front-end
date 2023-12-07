export interface Sale {
    id?: number;
    tourIds:Array<number>,
    authorId:number,
    startDate:Date,
    endDate:Date,
    discount:number
}