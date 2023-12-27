

export interface Club {
    id?: number;
    name: string;
    description: string;
    imageUrl: string;
    ownerId: number;
    memberIds: number[];
}

