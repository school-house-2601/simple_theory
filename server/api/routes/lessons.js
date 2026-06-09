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
  if (searchCache[query]) {
    console.log(`Serving "${query}" from cache (Saving 100 credits!)`);
    return res.json(searchCache[query]);
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&key=${API_KEY}`;

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

const flatCache = {};

router.get("/flat/search", async (req, res) => {
  const { query, instrument } = req.query;
  const cacheKey = `${query}-${instrument}`;

  if (flatCache[cacheKey]) {
    console.log(`Serving Flat.io "${cacheKey}" from cache`);
    return res.json(flatCache[cacheKey]);
  }

  try {
    const params = new URLSearchParams({
      q: query || "",
      limit: 20,
      ...(instrument && { instrument }),
    });

    const response = await fetch(
      `https://api.flat.io/v2/scores?${params}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLAT_TO_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Flat.io API Error:", err);
      return res.status(500).json({ error: "Flat.io API failed" });
    }

    const data = await response.json();
    flatCache[cacheKey] = data;
    res.json(data);
  } catch (err) {
    console.error("Flat.io fetch failed:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/flat/score/:scoreId", async (req, res) => {
  try {
    const { scoreId } = req.params;

    const response = await fetch(
      `https://api.flat.io/v2/scores/${scoreId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLAT_TO_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(404).json({ error: "Score not found" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

router.get("/flat/embed/:scoreId", async (req, res) => {
  const { scoreId } = req.params;
  res.json({
    embedURL: `https://flat.io/embed/${scoreId}?jsapi=true&layout=track&zoom=auto`,
  });
});

export default router;
