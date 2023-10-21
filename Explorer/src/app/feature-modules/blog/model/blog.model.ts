export enum BlogStatus {
    Draft = 'Draft',
    Published = 'Published',
    Closed = 'Closed'
}

export interface Blog {
    id? : number
    title : string
    description : string
    image : string
}