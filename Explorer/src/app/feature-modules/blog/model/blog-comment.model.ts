export interface BlogComment {
    id?: number;
    userId : number;
    blogId : number;
    text: string;
    creationTime : Date;
    lastModification : Date;
}