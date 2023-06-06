import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import config from 'config'
import cookieParser from 'cookie-parser'

import userRoute from './routes/user.route'
import connectDB from './utils/connect'

import session from 'express-session'
import passport from 'passport'

import sectionRoute from './routes/section.route'
import cors from 'cors'
import logger from './utils/logger'
import themeRoute from './routes/theme.route'
import categoryRoute from './routes/category.route'
import templateRouter from './routes/template.route'
import collectionRoute from './routes/collection.route'
import MessageResponse from './interfaces/MessageResponse'

// Port from config
const PORT = config.get('port') || (1213 as number)

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(
   session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
   })
)
app.use(passport.initialize())
app.use(passport.session())

app.listen(PORT, () => {
   logger.info('Server is running on port ' + PORT)

   // connection to databaseName
   connectDB()

   // root directory welcome message
   app.get<{}, MessageResponse>('/', (req, res) => {
      res.json({
         message: '✨ Welcome API Route Is Working 👋',
      })
   })

   // User route
   userRoute(app)
   // theme Route
   themeRoute(app)

   // category route
   categoryRoute(app)

   // Section  Routes
   sectionRoute(app)

   // Template Routes
   templateRouter(app)

   // Collection Routes
   collectionRoute(app)
})

export default app
