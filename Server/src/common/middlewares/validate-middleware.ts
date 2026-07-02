import type { NextFunction, Request, Response } from 'express';
import DtoBase from '../dto/dto-base.js';
import ApiError from '../utils/api-error.js';

export default function validate(dtoClass: typeof DtoBase) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, data } = dtoClass.validate(req.body);

    if (error) {
      return next(ApiError.badRequest(error));
    }

    req.body = data;
    next();
  };
}
