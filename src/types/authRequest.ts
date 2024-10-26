import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface authRequest extends Request {
  user?: JwtPayload | string;
}
