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

// Curated collections broken down by instrument context
const SCORES_BY_INSTRUMENT = {
  piano: [
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
    {
      id: "5e952c715607e31952c960f9-ode-to-joy-beethoven",
      title: "Beethoven - Ode to Joy",
      author: "Ludwig van Beethoven",
    },
    {
      id: "5a6a914c740a26430cac8a7e-legends-never-die-league-of-legends",
      title: "Legends Never Die",
      author: "League of Legends",
    },
  ],
  guitar: [
    {
      id: "63163f44d7e7de001372c925-sweet-child-o-mine",
      title: "Sweet Child O' Mine",
      author: "Guns N' Roses",
    },
    {
      id: "672aa9d648cbe5fe773d9eb1-free-bird",
      title: "Free Bird",
      author: "Lynyrd Skynyrd",
    },
    {
      id: "685adc5c37c9c175c0223bb4-seven-nation-army-simple-guitar",
      title: "Seven Nation Army",
      author: "The White Stripes",
    },
    {
      id: "616427d75423630012fe3dba-metallica-my-friend-of-misery-instrumental-version-new-leads",
      title: "My Friend of Misery",
      author: "Metallica",
    },
  ],
  drums: [
    {
      id: "5bcea37ddaede8225b26229d-bring-me-the-horizon-drown-drums",
      title: "Drown",
      author: "Bring Me the Horizon",
    },
    {
      id: "600d7e21b02781639f6fdba7-back-in-black-ac-dc-drum",
      title: "Back in Black",
      author: "AC/DC",
    },
    {
      id: "61faec8376e7e60014f3af76-thunder-imagine-dragons-string-orchestra-with-drums",
      title: "Thunder",
      author: "Imagine Dragons",
    },
    {
      id: "643da9839b46a6269fb35eca-mystery-turnstile",
      title: "Mystery",
      author: "Turnstile",
    },
  ],
  theory: [
    {
      id: "5e952c715607e31952c960f9-ode-to-joy-beethoven",
      title: "Beethoven - Ode to Joy",
      author: "Ludwig van Beethoven",
    },
    {
      id: "69b22f36b871661374763b98-for-beginners-lesson-1-the-very-basics",
      title: "Beginner Piano Scales",
      author: "Music Theory Basics",
    },
  ],
};

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
// FIXED: Contextual Instrument Notation Filter
// ==========================================
router.get("/flat-search", async (req, res) => {
  console.log("here");
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  // Check the runtime memory cache first
  if (flatSearchCache[query]) {
    console.log(`Serving Flat.io "${query}" from cache`);
    return res.json(flatSearchCache[query]);
  }

  try {
    const lowerQuery = query.toLowerCase();
    let instrumentKey = null;

    // 1. Map queries explicitly to your SCORES_BY_INSTRUMENT keys
    if (lowerQuery.includes(piano.title)) instrumentKey = "piano";
    else if (lowerQuery.includes(guitar.title)) instrumentKey = "guitar";
    else if (lowerQuery.includes(drum.title)) instrumentKey = "drums";
    else if (lowerQuery.includes("theory")) instrumentKey = "theory";

    // 2. Fetch only that instrument's unique collection bucket
    const targetCollection = SCORES_BY_INSTRUMENT[instrumentKey] || [];
    console.log("targetCollection", targetCollection);
    // 3. Remove the global || "theory" override. Only filter by title if the query is a specific search term.
    // If it's a generic pill query (like "Guitar lessons"), we just return the full guitar collection.
    const isGenericPillQuery =
      lowerQuery.includes("tutorial") ||
      lowerQuery.includes("lessons") ||
      lowerQuery.includes("beginners") ||
      lowerQuery.includes("basics");

    let finalResults = targetCollection;
    console.log("finalResults", finalResults);
    console.log(isGenericPillQuery);
    if (!isGenericPillQuery) {
      const filteredScores = targetCollection.filter((score) => {
        console.log(score);
        return score.title.toLowerCase().includes(lowerQuery);
      });
      // Fall back to the main instrument bucket if a targeted search returns empty
      if (filteredScores.length > 0) {
        finalResults = filteredScores;
        console.log("finalResults2", finalResults);
      }
    }

    // Save clean results to backend runtime cache
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
