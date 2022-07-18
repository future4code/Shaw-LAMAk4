import express from 'express'
import { UserBusiness } from '../business/UserBusiness'
import { UserController } from '../controller/UserController'
import { UserDatabase } from '../data/UserDatabase'
import { Authenticator } from '../services/Authenticator'


const userController = new UserController(
    new UserBusiness(
        new UserDatabase(),
        Authenticator
    )
)

export const userRouter = express.Router()

userRouter.post('/signup', userController.signUp)
userRouter.post('/login', userController.login) 