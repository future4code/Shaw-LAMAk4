import { app } from './controller/app'
import { bandRouter } from './routes/bandRouter'




app.use('/band', bandRouter)