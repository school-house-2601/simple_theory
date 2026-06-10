import { Router } from "express";

const router = Router();

router.get("/auth", (req, res) => {
    const clientId = process.env.FLAT_IO_CLIENT_ID;
    const redirectUri = process.env.FLAT_IO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return res.status(500).json({
            error: "Missing Flat.io config",
            hasClientId: !!clientId,
            hasRedirectUri: !!redirectUri
        });
    }

    const authUrl = `https://flat.io/auth/oauth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=score.readonly`;

    console.log("Redirecting to:", authUrl);
    return res.redirect(authUrl);
});    

router.get("/auth/callback", async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    try {
        const response = await fetch("https://api.flat.io/oauth/access_token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: process.env.FLAT_IO_REDIRECT_URI,
                client_id: process.env.FLAT_IO_CLIENT_ID,
                client_secret: process.env.FLAT_IO_CLIENT_SECRET,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ error: "Token exchange failed", details: data });
        }

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        res.redirect(`${process.env.CLIENT_URL}/practice?flat_token=${data.access_token}`);
    } catch (err) {
        console.error("Flat OAuth error:", err);
        res.status(500).json({ error: "OAuth failed" });
    }
});

router.get("/search", async (req, res) => {
    const { query, instrument, token } = req.query;
    if (!token) return res.status(401).json({ error: "No Flat.io token" });

    try {
        const params = new URLSearchParams({ q: query || "", limit: 20,});
        if (instrument) params.append("instruments", instrument);

        const response = await fetch(
            `https://api.flat.io/v2/scores?${params}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
            console.err = await response.json();
            return res.status(response.status).json(err);
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
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

export default router;