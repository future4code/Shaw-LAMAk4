export enum DAY {
    FRIDAY = "FRI",
    SATURDAY = "SAT",
    SUNDAY = "SUN"
}

export type MarcarShow = {
    day: DAY,
    startingTime: number,
    endingTime: number,
    id: string
}