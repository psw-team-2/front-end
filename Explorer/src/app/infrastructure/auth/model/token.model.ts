export interface Token {
    id?: number;
    userId: number;
    value: string;
    expirationTime: Date;
}
  