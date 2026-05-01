import app from "#app";
import db from "#db/db";
import statsRouter from "./api/routes/stats";

const PORT = process.env.PORT ?? 3000;

await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

app.use("/api/stats", statsRouter)