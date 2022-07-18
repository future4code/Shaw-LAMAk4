import { DAY } from "../types/MarcarShow";

export class SetShow {
    constructor (
        private id: string,
        private day: DAY,
        private startingTime: number,
        private endingTime: number,
        private bandId: string,
    ) {}

    public getId(): string {
        return this.id
    }

    public getDay(): DAY {
        return this.day
    }

    public getStartingTime(): number {
        return this.startingTime
    }

    public getEndingTime(): number {
        return this.endingTime
    }

    public getBandId(): string {
        return this.bandId
    }

    static toUserModel(setShow: any): SetShow {
        return new SetShow(
            setShow.id,
            setShow.day,
            setShow.startingTime,
            setShow.endingTime,
            setShow.bandId
        )
    }
}