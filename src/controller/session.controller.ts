import { Request, Response } from 'express'
import { createUserSession } from '../service/session.service'
import { updateSession, validatePassword } from '../service/user.service'
import { signJwt } from '../utils/jwt.utils'
import logger from '../utils/logger'
import config from 'config'

const ACCESS_TOKEN_EXPIRE_TIME = config.get<number>('accessTokenExpireTime')
const REFRESH_TOKEN_EXPIRE_TIME = config.get<number>('refreshTokenExpireTime')

export async function createUserSessionHandler(req: Request, res: Response) {
   // validate user Passowrd
   const user = await validatePassword(req.body)

   if (!user) {
      return res.status(400).send({
         message: 'Invalid email or password',
      })
   }

   // create session
   const session = await createUserSession(
      user._id,
      req.get('user-agent' || ''),
   )

   // create accessToken controller
   const accessToken = signJwt(
      {
         ...user,
         sessionId: session._id,
      },
      { expiresIn: ACCESS_TOKEN_EXPIRE_TIME },
   )

   // create refreshToken controller
   const refreshToken = signJwt(
      {
         ...user,
         sessionId: session._id,
      },
      { expiresIn: REFRESH_TOKEN_EXPIRE_TIME },
   )
   // set accessToken to cookie
   res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 900000, //15 min
      domain: 'localhost',
      path: '/',
      secure: false,
   })

   // set refreshToken to cookie
   res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 3.154e10, // 1 year
      domain: 'localhost',
      path: '/',
      secure: false,
   })

   // return Logged in user
   return res.status(200).send({
      message: 'User Logged In',
      accessToken: accessToken,
      refreshToken: refreshToken,
   })

   // if user already exist
   // create user session
   // return user session
}

// delete deleteSessionHandler function
export async function deleteSessionHandler(req: Request, res: Response) {
   const sessionId = res.locals.sessionId

   try {
      const user = await updateSession({ _id: sessionId }, { valid: false })
      return res.status(200).json({
         message: 'Logout Succesfull',
         accessToken: null,
         refreshToken: null,
      })
   } catch (e: any) {
      res.status(500).send(e)
   }
}
