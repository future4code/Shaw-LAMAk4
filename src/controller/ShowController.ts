import { Request, Response } from "express"
import { ShowBusiness } from "../business/ShowBusiness"
import { CustomError } from "../error/CustomError"
import { GetShowsDTO } from "../types/GetShowsDTO"
import { DAY } from "../types/MarcarShow"

export class ShowController {

    constructor(
        private showBusiness: ShowBusiness
    ){}

    public getShowsByDay = async (req: Request, res: Response) => {
        try {
            const day = req.params.day as DAY
            const token = req.headers.authorization as string

            const input: GetShowsDTO = { day, token  }

            const shows = await this.showBusiness.getShowsByName(input)

            res.status(200).send({ shows })
        } catch (error: any) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({ message: error.message })
            } else {
                res.status(500).send({ message: error.sqlMessage})
            }
        }
    }

    setShow = async (req: Request, res: Response) => {
        try {
            const { day, startingTime, endingTime, id } = req.body

            await this.showBusiness.setShow({day, startingTime, endingTime, id})

            res.send(`Show registered: ${day}, from ${startingTime}:00 to ${endingTime}:00`)
        } catch (error: any) {
            res.send(error.sqlMessage || error.message)
        }
    }
}