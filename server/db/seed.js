import db from "#db/db";
import bcrypt from "bcrypt";

async function seed() {
  try {
    await db.connect();
    console.log("Connected to database...");

    // Clear existing data - Added bookmarks and play_sessions to the list
    await db.query(
      "TRUNCATE users, content, user_progress, bookmarks, play_sessions RESTART IDENTITY CASCADE;",
    );

    // 1. Create Demo User
    // EDITS: Changed 'password' to 'password_hash' and 'xp' to 'total_xp'
    // EDITS: Added 'selected_path' and 'current_level' to satisfy NOT NULL constraints
    const hashedPassword = await bcrypt.hash("password123", 10);
    await db.query(
      `INSERT INTO users (username, email, password_hash, total_xp, selected_path, current_level) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        "theory_student",
        "demo@simpletheory.com",
        hashedPassword,
        1250,
        "Novice",
        "Novice",
      ],
    );

    // 2. Seed Content
    // EDITS: Difficulty and Type values capitalized to match ENUM ('Novice', 'Video', etc.)
    const contentItems = [
      {
        title: "Beginner Guitar: First Chords",
        type: "Video",
        difficulty: "Novice",
        instrument: "guitar",
        external_url: "https://youtube.com",
        thumbnail_url: "https://youtube.com",
        description: "Learn G, C, and D major chords to start playing songs.",
        xp_reward: 50,
      },
      {
        title: "C Major Scale Sheet Music",
        type: "Notation", // Matches your 'Notation' enum
        difficulty: "Novice",
        instrument: "guitar",
        external_url: "https://flat.io...",
        thumbnail_url: "https://unsplash.com",
        description: "Basic notation for the C Major scale.",
        xp_reward: 25,
      },
      {
        title: "Introduction to the Keyboard",
        type: "Video",
        difficulty: "Novice",
        instrument: "piano",
        external_url: "https://youtube.com",
        thumbnail_url: "https://youtube.com",
        description: "Identify notes and finger positioning.",
        xp_reward: 50,
      },
      {
        title: "How to set tempo in Ableton",
        type: "Video",
        difficulty: "Intermediate",
        instrument: "all",
        external_url: "https://youtube.com",
        thumbnail_url: "https://unsplash.com",
        description: "A quick tutorial on DAW rhythm management.",
        xp_reward: 100,
      },
      {
        title: "Advanced Jazz Improv",
        type: "Video",
        difficulty: "Professional", // Matches your 'Professional' enum
        instrument: "guitar",
        external_url: "https://youtube.com",
        thumbnail_url: "https://unsplash.com",
        description: "Using the Dorian mode over II-V-I progressions.",
        xp_reward: 200,
      },
    ];

    for (const item of contentItems) {
      await db.query(
        `INSERT INTO content (title, type, difficulty, instrument, external_url, thumbnail_url, description, xp_reward)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          item.title,
          item.type,
          item.difficulty,
          item.instrument,
          item.external_url,
          item.thumbnail_url,
          item.description,
          item.xp_reward,
        ],
      );
    }

    console.log("SimpleTheory Seeded Successfully! 🌱");
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await db.end();
  }
}

seed();
