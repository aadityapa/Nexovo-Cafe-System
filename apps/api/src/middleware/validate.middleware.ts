import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodError } from "zod";

type ValidationTarget = "body" | "params" | "query";

export function validate(schema: AnyZodObject, target: ValidationTarget = "body") {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(request[target]);
      request[target] = parsed;
      return next();
    } catch (error) {
      const zodError = error as ZodError;
      return response.status(400).json({
        message: "Validation failed",
        errors: zodError.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      });
    }
  };
}
