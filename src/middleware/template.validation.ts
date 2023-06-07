import { Request, Response, NextFunction } from 'express'
import { templateSchema } from '../schema/template.schema'
import logger from '../utils/logger'

export const validationTemplate = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   try {
      await templateSchema.validateAsync(req.body)
      logger.info('validation passed')
      next()
   } catch (e: any) {
      res.status(400).send({
         message: 'Invalid request',
         error: e.message,
      })
   }
}
