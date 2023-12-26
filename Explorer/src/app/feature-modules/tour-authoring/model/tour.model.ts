export interface Tour {
    id?: number,
    name: string,
    description: string,
    status: Number,
    difficulty: number,
    tags: string[],
    checkPoints: number[],
    equipment: number[],
    objects: number[],
    totalLength: number,
    footTime: Number,
    bicycleTime: Number,
    carTime: Number,
    authorId: number,
    publishTime: string
    price:number,
    points: number,
    image: string
}