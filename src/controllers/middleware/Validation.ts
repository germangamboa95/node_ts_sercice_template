import { NextFunction, Request, Response } from "express";
import {
  matchedData,
  MatchedDataOptions,
  ValidationChain,
  validationResult,
} from "express-validator";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req).formatWith(({ msg }) => msg);

    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({
      message: "Request Validation Failed",
      validation_errors: errors.mapped(),
    });
  };
};

export const getValidatedData = <T>(
  req: Request,
  options?: Partial<MatchedDataOptions>
): T => {
  return matchedData(req, options) as T;
};
