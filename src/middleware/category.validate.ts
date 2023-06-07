import { Request, Response, NextFunction } from 'express'

import {
   categorySchemaValidation,
   categorySearchSchemaValidation,
} from '../schema/category.schema'
import logger from '../utils/logger'

export const validateCategory = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   const status = JSON.parse(req.body.status)

   const data = {
      ...req.body,
      status,
   }
   try {
      await categorySchemaValidation.validateAsync(data)
      // attach the data to the request
      req.body = data
      next()
   } catch (e: any) {
      res.status(400).send({
         message: 'Invalid request',
         error: e.message,
      })
   }
}

// category search validation
export const validateCategorySearch = async (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   try {
      await categorySearchSchemaValidation.validateAsync(req.body)
      logger.info('Validation success')
      next()
   } catch (e: any) {
      logger.info('Validation failed')
      res.status(400).send({
         message: 'Invalid request',
         error: e.message,
      })
   }
}
