import { Request, Response, NextFunction } from 'express';
import { themeSchema } from '../schema/theme.schema';
import logger from '../utils/logger';

export const validateTheme = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await themeSchema.validateAsync(req.body);
    logger.info('Validation passed');
    next();
  } catch (e: any) {
    logger.info('Validation failed');
    res.status(400).send({
      message: 'Invalid request',
      error: e.message,
    });
  }
};
