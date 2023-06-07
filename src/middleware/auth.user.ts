import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // destarucre role with type
  const { role } = req.user as any;

  if (role.isAdmin) {
    next();
  } else {
    res.status(403).json({
      message: 'Forbidden',
    });
  }
};
