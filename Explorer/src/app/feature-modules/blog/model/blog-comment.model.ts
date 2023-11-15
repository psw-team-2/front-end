export interface BlogComment {
    id?: number;
    userId : number;
    username: string;
    blogId : number;
    text: string;
    creationTime : Date;
    lastModification : Date;
}