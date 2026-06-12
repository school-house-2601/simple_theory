/** Checks if the request body contains the required fields */
export default function requireBody(fields) {
  return (req, res, next) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const missing = fields.filter((field) => !(field in req.body));
    if (missing.length > 0)
      return res.status(400).send(`Missing fields: ${missing.join(", ")}`);

    next();
  };
}

/** Checks if the userId in the request body matches the logged-in user */
export function bodyIdMatchesSession() {
  return (req, res, next) => {
    if (req.body && req.body.userId) {
      if (Number(req.body.userId) !== Number(req.user.id)) {
        return res.status(401).send({
          message: `Cannot take actions on another users behalf.`,
        });
      }
    }
    next();
  };
}
