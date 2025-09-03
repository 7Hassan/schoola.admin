import { Request, Response, NextFunction } from 'express';
import z from 'zod';
import httpStatus from 'http-status';
import pick from '../../utils/pick';
import ApiError from '../errors/ApiError';

const validate =
  (schema: Record<string, any>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { success, data, error } = z.object(validSchema).safeParse(object);

    if (!success) {
      const errorMessage = error.issues.map((issue) => issue.message).join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, data);
    return next();
  };

export default validate;
