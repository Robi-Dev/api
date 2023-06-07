import { Request, Response, NextFunction } from 'express'
import { userSchema } from '../schema/user.schema'

export const validateUser = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   try {
      await userSchema.validateAsync(req.body)
      next()
   } catch (e: any) {
      res.status(400).send({
         message: 'Invalid request',
         error: e.message,
      })
   }
}

export default validateUser
