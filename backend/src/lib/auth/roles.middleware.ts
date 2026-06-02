import { Request, Response, NextFunction } from 'express';

export const isDipendente = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'dipendente') {
     res.status(404).json({ message: "L'utente non è un dipendente " });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const isResponsabile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'responsabile') {
     res.status(404).json({ message: "L'utente non è un responsabile" });
    }
    next();
  } catch (error) {
    next(error);
  }
};


