const express = require("express");

const app = express();
const PORT = 3002;

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

app.use(express.json());
app.use(express.static("public"));

app.post("/api/submit", async (req, res) => {
    try {
        const response = await fetch(`${BACKEND_URL}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        res.status(response.status).json(data);

    } catch (error) {
        console.error("Backend connection error:", error);

        res.status(500).json({
            error: "Unable to connect to Flask backend."
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Frontend server running on port ${PORT}`);
    console.log(`Backend URL: ${BACKEND_URL}`);
});