import { UserDatabase } from "../data/UserDatabase";
import { User } from "../model/User";
import { Authenticator } from "../services/Authenticator";
import { HashManage } from "../services/HashManage";
import IdGenerator from "../services/IdGenerator";
import { LoginInputDTO } from "../types/LoginInputDTO";
import { SignupInputDTO } from "../types/SignupInputDTO"
import { InvalidInputError } from "./errors/InvalidInputError";
import { NotFoundError } from "./errors/NotFoundError";
import { DAY, MarcarShow } from "../types/MarcarShow";
import { CustomError } from "./errors/CustomError";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private authenticator: Authenticator
    ){}

    signUp = async (user: SignupInputDTO) => {
        const { name, email, password, role } = user

        if(!name || !email || !password) {
            throw new InvalidInputError("Invalid input. Name, email and password are required")
        }

        if(password.length < 6) {
            throw new InvalidInputError("Invalid password. Password must have at least 6 characters")
        }

        if(email.includes("@") === false) {
            throw new InvalidInputError("Invalid email. Email must contain @")
        }

        const registeredUser = await this.userDatabase.getUserByEmail(email)

        if(registeredUser) {
            throw new NotFoundError("User already exists")
        }

        const id = IdGenerator.idGenerator()
        const cryptedPassword = await HashManage.generateHash(password)

        const newUser = new User(id, name, email, cryptedPassword, role)

        await this.userDatabase.insertUser(newUser)

        const token = Authenticator.generateToken({ id, role })

        return token
    }

    login = async (user: LoginInputDTO) => {
        const { email, password } = user

        if (!email || !password) {
            throw new InvalidInputError("Invalid input. Email and password are required")
        }

        const userFromDB = await this.userDatabase.getUserByEmail(email)

        if (!userFromDB) {
            throw new NotFoundError("Invalid credentials")
        }

        const isPasswordCorrect = HashManage.compare(password, userFromDB.getPassword())

        if(!isPasswordCorrect) {
            throw new NotFoundError("Invalid credentials")
        }

        const token = Authenticator.generateToken({
            id: userFromDB.getId(),
            role: userFromDB.getRole()
        })

        return token
    }

    setShow = async (dia: MarcarShow) => {
        const { day, startingTime, endingTime } = dia

        if(!day || !startingTime || !endingTime) {
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

        const showFromDB = await this.userDatabase.getShowByDayAndTime(day)
        // 9 - 12 : 11 - 13
        /* 8 - 11 : 12 - 14 : 16 - 18*/
        if()
    }
}