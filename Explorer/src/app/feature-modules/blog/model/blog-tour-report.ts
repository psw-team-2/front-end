

export interface BlogTourReport {
    tourId : number;
    startTime: Date;
    endTime: Date | undefined;
    length: number;
    equipment: (number|undefined)[];
    checkpointsVisited: number[];
}