import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";

import teamsRoutes from "./routes/teams.js";
import newsRoutes from "./routes/news.js";
import matchesRoutes from "./routes/matches.js";
import sponsorsRoutes from "./routes/sponsors.js";
import starPlayersRoutes from "./routes/starPlayers.js";
import betsRoutes from "./routes/bets.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/teams", teamsRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/matches", matchesRoutes);
app.use("/api/sponsors", sponsorsRoutes);
app.use("/api/star-players", starPlayersRoutes);
app.use("/api/bets", betsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 API de Sport Soccer 2027 corriendo en puerto ${PORT}`));
});