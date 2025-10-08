import { ZodSchema } from "zod";
import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

export const validationRequest = (schema: ZodSchema) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    await schema.parseAsync(req.body);
    next();
  });
};
