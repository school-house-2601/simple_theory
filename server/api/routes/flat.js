import { Router } from "express";

const router = Router();

const FLAT_CLIENT_ID = process.env.FLAT_IO_CLIENT_ID;
const FLAT_CLIENT_SECRET = process.env.FLAT_IO_CLIENT_SECRET;
const FLAT_REDIRECT_URI = process.env.FLAT_IO_REDIRECT_URI;

router.get("/auth", (req, res) => {
    const params = new URLSearchParams({
        response_type: "code",
        client_id: FLAT_CLIENT_ID,
        redirect_uri: FLAT_REDIRECT_URI,
        scope: "score.readonly",
    });
    res.redirect(`https://flat.io/auth/oauth?${params}`);
});

router.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "No code provided" });

    try {
        const response = await fetch("https://api.flat.io/oauth/access_token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: FLAT_REDIRECT_URI,
                client_id: FLAT_CLIENT_ID,
                client_secret: FLAT_CLIENT_SECRET,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Flat.io token error:", data);
            return res.status(500).json({ error: "Failed to get token" });
        }

        res.redirect(`${process.env.CLIENT_URL}/practice?flat_token=${data.access_token}`);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "OAuth failed" });
    }
});

router.get("/search", async (req, res) => {
    const { query, instrument, token } = req.query;
    if (!token) return res.status(401).json({ error: "No Flat.io token" });

    try {
        const params = new URLSearchParams({
            q: query || "",
            limit: 20,
        });

        if (instrument) {
            params.append("instruments", instrument);
        }

        const response = await fetch(
            `https://api.flat.io/v2/scores?${params}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error("Flat.io API Error:", text);
            return res.status(response.status).json({ error: text });
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Search failed" });
    }
});

router.get("/score/:scoreId", async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(401).json({ error: "No Flat.io token" });

    try {
        const response = await fetch(
            `https://api.flat.io/v2/scores/${req.params.scoreId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch score" });
    }
});

router.get("/me", async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(401).json({ error: "No token" });
    
    const response = await fetch("https://api.flat.io/v2/me", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const text = await response.text();
    res.send(text);
});

router.get("/test", (req, res) => {
    res.json({
        hasClientId: !!FLAT_CLIENT_ID,
        hasClientSecret: !!FLAT_CLIENT_SECRET,
        hasRedirectUri: !!FLAT_REDIRECT_URI,
        redirectUri: FLAT_REDIRECT_URI,
    });
});

export default router;