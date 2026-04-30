import express from "express";
import authRouter from "#api/routes/auth";
import lessonsRouter from "#api/routes/lessons";
import statsRouter from "#api/routes/stats";
import usersRouter from "#api/routes/users";
import getUserFromToken from "#middleware/getUserFromToken";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getUserFromToken);

app.use("/auth", authRouter);
app.use("/lessons", lessonsRouter);
app.use("/stats", statsRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  // A switch statement can be used instead of if statements
  // when multiple cases are handled the same way.
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // Unique constraint violation
    case "23505":
    // Foreign key violation
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;
