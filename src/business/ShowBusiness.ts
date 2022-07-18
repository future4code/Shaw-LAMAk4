import { ShowDataBase } from "../data/ShowDataBase"
import { UserDatabase } from "../data/UserDatabase"
import { CustomError } from "../error/CustomError"
import { Authenticator } from "../services/Authenticator"
import { GetShowsDTO } from "../types/GetShowsDTO"
import { DAY } from "../types/MarcarShow"


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
}