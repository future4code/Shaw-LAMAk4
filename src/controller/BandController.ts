import { Request, Response } from "express";
import { BandBusiness } from "../business/BandBusiness";
import { CustomError } from "../error/CustomError";
import { GetBandDTO } from "../types/GetBandDTO";
import { BandInputDTO } from "../types/RegisterBandDTO";

export class BandController {

    constructor(
        private bandBusiness: BandBusiness
    ){}

    public registerBand = async (req: Request, res: Response) => {
        try {
            const { name, musicGenre, responsible } = req.body
            const token = req.headers.authorization as string

            const band: BandInputDTO = { name, musicGenre, responsible, token  }

            await this.bandBusiness.registerBand(band)

            res.status(201).send({ message: `${name} was successfully registered.` })
        } catch (error: any) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({ message: error.message })
            } else {
                res.status(500).send({ message: error.sqlMessage})
            }
        }
    }

    public getBand = async (req: Request, res: Response) => {
        try {
            const id = req.query.id as string
            const name = req.query.name as string
            const token = req.headers.authorization as string

            const input: GetBandDTO = { id , name, token  }

            const bands = await this.bandBusiness.getBand(input)

            res.status(201).send({bands})
        } catch (error: any) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).send({ message: error.message })
            } else {
                res.status(500).send({ message: error.sqlMessage})
            }
        }
    }
}