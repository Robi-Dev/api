import { Request, Response, NextFunction } from 'express'
import { loginSchema } from '../schema/user.schema'

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationResult = await loginSchema.validateAsync(req.body)
    next()
  } catch (e: any) {
    res.status(400).send({
      message: 'Invalid request',
      error: e.message,
    })
  }
}

export default validateLogin
