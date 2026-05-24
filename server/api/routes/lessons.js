import { Router } from "express";
import {
  getAllContent,
  getContentById,
  getContentByDifficulty,
  getContentByType,
} from "#db/queries/contentQueries";

const router = Router();
const searchCache = {};
const flatSearchCache = {};

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

// ==========================================
// NEW: Flat.io Notation Search Endpoint
// ==========================================
// router.get("/flat-search", async (req, res) => {
//   const { query } = req.query;

//   if (!query) {
//     return res.status(400).json({ error: "Query parameter is required" });
//   }

//   // Serve from cache if it exists
//   if (flatSearchCache[query]) {
//     console.log(`Serving Flat.io "${query}" from cache`);
//     return res.json(flatSearchCache[query]);
//   }

//   const token = process.env.FLAT_IO_SEARCH_API_KEY;
//   const url = `https://api.flat.io/v2/scores/search?q=${encodeURIComponent(query)}&limit=10`;

//   try {
//     const response = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Flat.io API Error:", errorText);
//       return res.status(response.status).send("Flat.io API failed");
//     }

//     const data = await response.json();

//     // Flat.io public search wraps the list inside a .results array
//     const scoreItems = data.results || data || [];

//     flatSearchCache[query] = scoreItems;
//     res.json(scoreItems);
//   } catch (error) {
//     console.error("Flat.io Fetch failed:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// ==========================================
// NEW: Flat.io Notation Search Endpoint
// ==========================================
router.get("/flat-search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  if (flatSearchCache[query]) {
    console.log(`Serving Flat.io "${query}" from cache`);
    return res.json(flatSearchCache[query]);
  }

  // A curated list of real, public community sheet music IDs on Flat.io
  const publicScoresCollection = [
    {
      id: "5bf61aea0309282b0a91fb0e-the-house-of-the-rising-sun",
      title: "House of the Rising Sun",
      author: "Traditional",
    },
    {
      id: "5e952c715607e31952c960f9-ode-to-joy-beethoven",
      title: "Beethoven - Ode to Joy",
      author: "Ludwig van Beethoven",
    },
    {
      id: "5ea6694a5fbac32d7d710c4a-mozart-sonata-16-in-c-2nd-movement",
      title: "Mozart - Piano Sonata No. 16",
      author: "Wolfgang Amadeus Mozart",
    },
    {
      id: "69b22f36b871661374763b98-for-beginners-lesson-1-the-very-basics",
      title: "Beginner Piano Scales",
      author: "Music Theory Basics",
    },
  ];

  try {
    // Filter the collection to see if any titles match your search pill/query
    const filteredScores = publicScoresCollection.filter(
      (score) =>
        score.title.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes("theory") ||
        query.toLowerCase().includes("tutorial"),
    );

    // If no specific match, default to showing the general list so the row isn't empty
    const finalResults =
      filteredScores.length > 0 ? filteredScores : publicScoresCollection;

    flatSearchCache[query] = finalResults;
    res.json(finalResults);
  } catch (error) {
    console.error("Flat.io List failed:", error);
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
