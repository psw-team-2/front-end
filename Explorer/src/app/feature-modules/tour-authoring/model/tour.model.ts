export interface Tour {
    id?: number,
    name: string,
    description: string,
    difficulty: number,
    tags: string,
    checkPoints: Number[],
    equipments: Number[]
}