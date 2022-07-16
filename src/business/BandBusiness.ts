import { BandDataBase } from "../data/BandDataBase"
import { UserDatabase } from "../data/UserDatabase"
import { CustomError } from "../error/CustomError"
import BandModel from "../model/BandModel"
import { Authenticator } from "../services/Authenticator"
import { HashManage } from "../services/HashManage"
import IdGenerator from "../services/IdGenerator"
import { bandDataBaseOutput } from "../types/bandDataBaseOutput"
import { GetBandDTO } from "../types/GetBandDTO"
import { BandInputDTO } from "../types/RegisterBandDTO"

export class BandBusiness {
    constructor(
        private bandDatabase: BandDataBase,
        private userDatabase: UserDatabase,
    ) { }

    public registerBand = async (band: BandInputDTO) => {
        try {
            const { name, musicGenre, responsible, token } = band

            if (!token) {
                throw new CustomError(401, "Token not found.")
            }

            const userInformation = Authenticator.getTokenData(token)

            if (!userInformation) {
                throw new CustomError(401, "Invalid Token.")
            }

            if (!name || !musicGenre || !responsible) {
                throw new CustomError(422, "Invalid input. Name, musicGenre and responsible are required.")
            }
            const checkUser = await this.userDatabase.getUserById(userInformation.id)

            if (checkUser.length === 0) {
                throw new CustomError(401, "Unregistered user.")
            }

            const checkBandName: bandDataBaseOutput[] = await this.bandDatabase.getBandByName(name)

            if (checkBandName.length > 0) {
                throw new CustomError(409, "This band name is already registered in the system.")
            }

            const checkBandResponsible: bandDataBaseOutput[] = await this.bandDatabase.getBandByName(responsible)

            if (checkBandResponsible.length > 0) {
                throw new CustomError(409, "This person is already responsible for another band.")
            }


            const id = IdGenerator.idGenerator()

            const newBand: BandModel = new BandModel(id, name, musicGenre, responsible)

            await this.bandDatabase.registerBand(newBand)

        } catch (error: any) {

            if (error instanceof CustomError) {
                throw new CustomError(error.statusCode, error.message)
            }

            throw new CustomError(500, error.sqlMessage || error.message)
        }
    }

    public getBand = async (input: GetBandDTO) => {
        try {
            const { id, name, token } = input

            if (!token) {
                throw new CustomError(401, "Token not found.")
            }

            const userInformation = Authenticator.getTokenData(token)

            if (!userInformation) {
                throw new CustomError(401, "Invalid Token.")
            }

            if (!name && !id) {
                throw new CustomError(422, "Invalid input. Name or id are required.")
            }
            const checkUser = await this.userDatabase.getUserById(userInformation.id)

            if (checkUser.length === 0) {
                throw new CustomError(401, "Unregistered user.")
            }

            const bands: bandDataBaseOutput[] =  await this.bandDatabase.getBandByIdOrName(id, name)

            if(bands.length === 0){
                throw new CustomError(404, "Band not found.")
            }

            return bands

        } catch (error: any) {

            if (error instanceof CustomError) {
                throw new CustomError(error.statusCode, error.message)
            }

            throw new CustomError(500, error.sqlMessage || error.message)
        }
    }
}