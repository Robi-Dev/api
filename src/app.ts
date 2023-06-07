import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import dotenv from 'dotenv'

dotenv.config()
import cookieParser from 'cookie-parser'

import session from 'express-session'
import passport from 'passport'

import * as middlewares from './middlewares'
import api from './api'
import MessageResponse from './interfaces/MessageResponse'

require('dotenv').config()

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
   }),
)
app.use(passport.initialize())
app.use(passport.session())

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.get<{}, MessageResponse>('/', (req, res) => {
   res.json({
      message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
   })
})

app.use('/api/v1', api)

// app.use(middlewares.notFound);
// app.use(middlewares.errorHandler);

export default app
