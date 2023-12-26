export interface PagedResults<T>{
    items: any;
    length: number;
    data: never[];
    results: T[];
    totalCount: number;
}
  