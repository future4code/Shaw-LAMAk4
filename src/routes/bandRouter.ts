import express from 'express'
import { BandBusiness } from '../business/BandBusiness';
import { BandController } from '../controller/BandController';
import { BandDataBase } from '../data/BandDataBase';
import { UserDatabase } from '../data/UserDatabase';


const bandController = new BandController(
    new BandBusiness(
        new BandDataBase(),
        new UserDatabase()
    )
)

export const bandRouter = express.Router()

bandRouter.get('', bandController.getBand) 
bandRouter.post('/register', bandController.registerBand)