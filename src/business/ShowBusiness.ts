import { ShowDataBase } from "../data/ShowDataBase"
import { UserDatabase } from "../data/UserDatabase"
import { CustomError } from "../error/CustomError"
import { SetShow } from "../model/SetShow"
import { Authenticator } from "../services/Authenticator"
import IdGenerator from "../services/IdGenerator"
import { GetShowsDTO } from "../types/GetShowsDTO"
import { DAY, MarcarShow } from "../types/MarcarShow"
import { InvalidInputError } from "./errors/InvalidInputError"


export class ShowBusiness {
    constructor(
        private showDatabase: ShowDataBase,
        private userDatabase: UserDatabase,
    ) { }

    public getShowsByName = async (input: GetShowsDTO) => {
        try {
            const { day, token } = input

            if (!token) {
                throw new CustomError(401, "Token not found.")
            }

            const userInformation = Authenticator.getTokenData(token)

            if (!userInformation) {
                throw new CustomError(401, "Invalid Token.")
            }

            const checkUser = await this.userDatabase.getUserById(userInformation.id)

            if (checkUser.length === 0) {
                throw new CustomError(401, "Unregistered user.")
            }

            if(day !== DAY.FRIDAY && day !== DAY.SATURDAY && day !== DAY.SUNDAY){
                throw new CustomError(422, "Day must be FRI, SUN OR SAT.")
            }

            const shows = await this.showDatabase.getShows(day)

            if(shows.length === 0){
                throw new CustomError(404, "There is no show registered for this day.")
            }

            return shows

        } catch (error: any) {

            if (error instanceof CustomError) {
                throw new CustomError(error.statusCode, error.message)
            }

            throw new CustomError(500, error.sqlMessage || error.message)
        }
    }

    public setShow = async (dia: MarcarShow) => {
        const { day, startingTime, endingTime, id } = dia

        if(!day || !startingTime || !endingTime || !id) {
            throw new InvalidInputError("Invalid input. day and time are required")
        }

        if(day !== DAY.FRIDAY && day !== DAY.SATURDAY && day !== DAY.SUNDAY){
            throw new CustomError(400, "day must be FRIDAY, SUNDAY OR SATURDAY")
        }

        if (startingTime < 8 || startingTime > 22) {
            throw new CustomError(400, "The starting time must be between 8h and 22h")
        }

        if (endingTime < 9 || endingTime > 23) {
            throw new CustomError(400, "The ending time must be between 9 and 23")
        }

        const showFromDB = await this.showDatabase.getShowByDayAndTime(day)

        showFromDB.forEach((show)=>{
            if(show.start_time<startingTime && show.end_time>startingTime){
                throw new CustomError(409, `Starting time not available, ${show.start_time}:00 - ${show.end_time}:00`)
            }
            if(show.start_time<endingTime && show.end_time>endingTime){
                throw new CustomError(409, `Ending time not available, ${show.start_time}:00 - ${show.end_time}:00`)
            }
            if(show.start_time>startingTime&&show.start_time<endingTime){
                throw new CustomError(409, `Ending time not available, another show starts before the wanted ending time, ${show.start_time}:00 - ${show.end_time}:00`)
            }
            if(show.end_time>startingTime&&show.end_time<endingTime){
                throw new CustomError(409, `Time not available, ${show.start_time}:00 - ${show.end_time}:00`)
            }
        })

        const showId = IdGenerator.idGenerator()

        const show = new SetShow(showId, day, startingTime, endingTime, id)

        await this.showDatabase.insertShow(show)
    }
}