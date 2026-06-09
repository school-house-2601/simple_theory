import app from "#app";
import db from "#db/db";
import statsRouter from "./api/routes/stats";
import bookmarksRouter from "./api/routes/bookmarks.js";
import progressRouter from "./api/routes/progress.js";
import xpRouter from "./api/routes/xp.js";
import usersRouter from "./api/routes/users.js";
import lessonsRouter from "./api/routes/lessons.js";
import flatRouter from "./api/routes/flat.js";

const PORT = process.env.PORT ?? 3000;

app.use("/api/stats", statsRouter)
app.use("/api/bookmarks", bookmarksRouter);
app.use("/api/progress", progressRouter);
app.use("/api/xp", xpRouter);
app.use("/api/users", usersRouter);
app.use("/api/lessons", lessonsRouter);
app.use("/api/flat", flatRouter);

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});