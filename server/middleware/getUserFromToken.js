import { getUserById } from "#db/queries/userQueries";
import { verifyToken } from "#utils/jwt";

export default async function getUserFromToken(req, res, next) {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) return next();

  const token = authorization.split(" ")[1];

  // 👇 Skip JWT verification for Google OAuth tokens — Passport handles those
  if (token.startsWith("google-oauth")) return next();

  try {
    const { id } = verifyToken(token);
    const user = await getUserById(id);
    if (!user) return next();
    req.user = user;
    next();
  } catch (e) {
    console.error("Token verification failed:", e.message);
    res.status(401).send("Invalid or expired token.");
  }
}
