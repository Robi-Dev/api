import { Request, Response, NextFunction } from 'express'
import { sectionSchema } from '../schema/section.schema'
import logger from '../utils/logger'

export const validateSectionRequest = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   try {
      await sectionSchema.validateAsync(req.body)
      logger.info('validation passed')
      next()
   } catch (e: any) {
      res.status(400).send({
         message: 'Invalid request',
         error: e.message,
      })
   }
}
