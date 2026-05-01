import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("JWT_SECRET is not set in .env");

/** Creates a token with the given payload */
export function createToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

/** Extracts the payload from a token */
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
