export interface Bundle {
    id?: number;
    userId: number;
    name: string;
    price: number;
    tours: number[];
    status: BundleStatus;
  }
  
  export enum BundleStatus {
    Draft = 0,
    Published = 1,
    Archived = 2
  }
  