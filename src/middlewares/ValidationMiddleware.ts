// import { NextFunction, Request, Response } from "express";
// import { plainToInstance } from "class-transformer";
// import { validate } from "class-validator";

// export function validationMiddleware(type: any) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const dto = plainToInstance(type, req.body);
//     const validationErrors = await validate(dto);
//     if (validationErrors.length > 0) {
//       const errorMessages = validationErrors.map((error) => error.constraints);
//       res.status(400).json({ message: "Validation failed", errors: errorMessages });
//       return;
//     }

//     next();
//   };
// }

import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export function validationMiddleware(type: any, source: "body" | "query" = "body") {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, source === "body" ? req.body : req.query);
    const validationErrors = await validate(dto);
    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.reduce((acc, error) => {
        acc[error.property] = Object.values(error.constraints || {});
        return acc;
      }, {} as Record<string, string[]>);
      res.status(400).json({ message: "Validation failed", errors: errorMessages });
      return;
    }

    next();
  };
}
