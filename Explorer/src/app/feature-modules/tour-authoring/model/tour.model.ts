export interface Tour {
    id?: number,
    name: string,
    description: string,
    difficulty: number,
    tags: string[],
    checkPoints: number[],
    equipment: number[],
    objects: number[],
    status: Number,
    totalLength: number,
    footTime: Number,
    bicycleTime: Number,
    carTime: Number,
    authorId: number,
    publishTime: string
    price:number
}