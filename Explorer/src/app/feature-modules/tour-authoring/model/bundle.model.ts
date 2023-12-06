export interface Bundle {
    id?: number;
    userId: number;
    name: string;
    price: number;
    status: BundleStatus;
    tours: number[];
  }
  
  export enum BundleStatus {
    Draft = 0,
    Published = 1,
    Archived = 2
  }
  