import { Router } from "express";
import {
  getAllContent,
  getContentById,
  getContentByDifficulty,
  getContentByType,
} from "#db/queries/contentQueries";

const router = Router();
const searchCache = {};

router.get("/", async (req, res) => {
  try {
    const lessons = await getAllContent();
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

router.get("/youtube-search", async (req, res, next) => {
  const { query } = req.query;

  // If you are in development mode, just return fake data and exit
  if (process.env.NODE_ENV === "development") {
    return res.json({
      items: [{ id: { videoId: "mock" }, snippet: { title: "Mock Video" } }],
    });
  }
  if (searchCache[query]) {
    console.log(`Serving "${query}" from cache (Saving 100 credits!)`);
    return res.json(searchCache[query]);
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("YouTube API Error:", errorText);
      return res.status(500).send("YouTube API failed");
    }

    const data = await response.json();
    searchCache[query] = data;

    res.json(data);
  } catch (error) {
    console.error("Fetch failed:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/difficulty/:level", async (req, res) => {
  try {
    const lessons = await getContentByDifficulty(req.params.level);
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch lessons by difficulty" });
  }
});

router.get("/type/:type", async (req, res) => {
  try {
    const lessons = await getContentByType(req.params.type);
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch lessons by type" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lesson = await getContentById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
});

export default router;
