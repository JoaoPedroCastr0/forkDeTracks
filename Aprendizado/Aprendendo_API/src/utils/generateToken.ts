import jwt from "jsonwebtoken";

export function generateToken(payload: object) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não definido");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
}