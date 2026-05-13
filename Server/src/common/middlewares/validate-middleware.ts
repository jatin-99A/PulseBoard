import type { NextFunction, Request, Response } from 'express';
import DtoBase from '../dto/dto-base.js';
import ApiError from '../utils/api-error.js';

export default function validate(dotoClass: unknown) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, data } = DtoBase.validate(req.body);

    if (error) {
      return next(ApiError.badRequest(error));
    }

    req.body = data;
    next();
  };
}
