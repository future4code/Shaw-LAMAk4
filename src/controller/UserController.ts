import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { LoginInputDTO } from "../types/LoginInputDTO";
import { SignupInputDTO } from "../types/SignupInputDTO";

export class UserController {

    constructor(
        private userBusiness: UserBusiness
    ){}

    signUp = async (req: Request, res: Response) => {
        try {
            const { name, email, password, role } = req.body

            const user: SignupInputDTO = { name, email, password, role }

            const token = await this.userBusiness.signUp(user)

            res.status(201).send({ message: "User created successfully", token })
        } catch (error: any) {
            res.status(error.statusCode || 500).send({
                message: error.message
            })
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            const user: LoginInputDTO = {
                email, password
            }

            const token = await this.userBusiness.login(user)

            res.status(200).send({ message: "User logged in successfully", token })

        } catch (error: any) {
            res.status(error.statusCode || 500).send({ message: error.message })
        }
    }

    // marcarShow = async (req: Request, res: Response) => {
    //     try {
    //         const { day, startingTime, endingTime } = req.body

    //         // const marcar = await this.userBusiness.setShow()
    //     } catch (error) {
            
    //     }
    // }
}

//  Para cadastrar um show, o endpoint precisa do id da banda, o dia (sexta, sábado ou domingo) e o horário em que ela irá se apresentar.
//  Deve haver uma validação para indicar se o horário é válido (ou seja, se está entre 08h e 23h). 
//  Além disso os shows só podem ser marcados em horários redondos,
//  ou seja, pode ser 08h - 09h ou 09h - 13h mas não pode ser 09h - 10h30 ou 10h30 - 14h.

// Caso já exista um show marcado para o dia e o horário em questão, o seu endpoint deve retornar um erro. 
// Faça ao menos dois testes para checar se os dados estão corretos, 
// sendo um em caso de erro e outro em caso de show em data repetida.