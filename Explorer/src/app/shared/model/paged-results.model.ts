export interface PagedResults<T>{
    items: import("d:/PSW projekat/front-end/Explorer/src/app/feature-modules/tour-authoring/model/tour.model").Tour[];
    results: T[];
    totalCount: number;
}
  