import { app } from './controller/app'
import { bandRouter } from './routes/bandRouter'
import { showRouter } from './routes/showRouter'
import { userRouter } from './routes/userRouter'

app.use('/user', userRouter)
app.use('/band', bandRouter)
app.use('/show', showRouter)