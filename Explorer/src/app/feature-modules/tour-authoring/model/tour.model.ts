export interface Tour {
    id?: number,
    name: string,
    description: string,
    difficulty: number,
    tags: string,
    checkpoints: Number[],
    equipments: Number[]
}