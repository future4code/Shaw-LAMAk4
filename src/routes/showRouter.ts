import express from 'express'
import { ShowBusiness } from '../business/ShowBusiness';
import { ShowController } from '../controller/ShowController';
import { ShowDataBase } from '../data/ShowDataBase';
import { UserDatabase } from '../data/UserDatabase';


const showController = new ShowController(
    new ShowBusiness(
        new ShowDataBase(),
        new UserDatabase()
    )
)

export const showRouter = express.Router()

showRouter.get('/:day', showController.getShowsByDay) 
showRouter.post('/register', showController.setShow) 
