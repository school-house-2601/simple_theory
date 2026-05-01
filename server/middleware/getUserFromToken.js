import { getUserById } from "#db/queries/userQueries"; // Updated path
import { verifyToken } from "#utils/jwt";

export default async function getUserFromToken(req, res, next) {
  const authorization = req.get("authorization");

  // If no token, just move on (protected routes will handle the 401 later)
  if (!authorization || !authorization.startsWith("Bearer ")) return next();

  const token = authorization.split(" ")[1];
  try {
    const { id } = verifyToken(token);
    const user = await getUserById(id);

    // If the user doesn't exist in DB anymore, don't attach anything
    if (!user) return next();

    req.user = user; // Now req.user.id works in your routes!
    next();
  } catch (e) {
    console.error("Token verification failed:", e.message);
    // Standard practice is to send 401 for an invalid token
    res.status(401).send("Invalid or expired token.");
  }
}
