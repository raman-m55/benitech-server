import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import ClientError from '../errors/clientEroors';

const validateMiddleware = (validateSchema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const clientError = new ClientError();
    const validationClass = plainToInstance(validateSchema, body);
    validate(validationClass, {}).then((errors) => {
      if (errors.length > 0) {
        clientError.message = errors.map((err) => {
          return { [err.property]: Object.values(err.constraints || {}) };
        });

        res.status(400).send(clientError);
      } else {
        next();
      }
    });
  };
};

export default validateMiddleware;
