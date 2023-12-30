export interface TourBundle{
    id : number,
    name: String,
    description: String,
    status: AccountStatus
    difficulty: number,
    price: number,
    footTime: number,
    bicycleTime: number,
    carTime: number,
    totalLength: number,
    publishTime: Date,
    authorId: number,
    isAdded: boolean,
    image: string
}

export enum AccountStatus {
    Draft = 0,   
    Published = 1,
    Archived = 2
  }