import { UserDatabase } from "../data/UserDatabase";
import { User } from "../model/User";
import { Authenticator } from "../services/Authenticator";
import { HashManage } from "../services/HashManage";
import IdGenerator from "../services/IdGenerator";
import { LoginInputDTO } from "../types/LoginInputDTO";
import { SignupInputDTO } from "../types/SignupInputDTO"
import { InvalidInputError } from "./errors/InvalidInputError";
import { NotFoundError } from "./errors/NotFoundError";

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
}