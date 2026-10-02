import { Router } from "express";
import Parser from "rss-parser";
import News from "../models/News.js";
import { requireAdmin } from "./admin.js";

const router = Router();
const parser = new Parser();

const FEEDS = [
  { url: "http://feeds.bbci.co.uk/sport/football/rss.xml", source: "BBC Sport" },
  { url: "https://www.espn.com/espn/rss/soccer/news", source: "ESPN" },
];

router.get("/", async (req, res) => {
  const news = await News.find().sort({ publishedAt: -1 });
  res.json(news);
});

router.get("/:id", async (req, res) => {
  const item = await News.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "not_found" });
  res.json(item);
});

router.post("/refresh-live", async (req, res) => {
  let totalNuevas = 0;
  try {
    for (const feed of FEEDS) {
      const parsed = await parser.parseURL(feed.url);
      const items = parsed.items.slice(0, 8);
      for (const item of items) {
        const exists = await News.findOne({ link: item.link });
        if (exists) continue;
        await News.create({
          title: item.title,
          summary: (item.contentSnippet || item.summary || "").slice(0, 280),
          image: item.enclosure?.url || null,
          link: item.link,
          source: feed.source,
          isExternal: true,
          publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
        });
        totalNuevas++;
      }
    }
    res.json({ ok: true, nuevas: totalNuevas });
  } catch (err) {
    res.status(500).json({ ok: false, error: "No se pudo conectar a los feeds de noticias", detail: err.message });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  const { title, summary, body, image } = req.body;
  if (!title) return res.status(400).json({ error: "title_required" });
  const created = await News.create({ title, summary, body, image, source: "Sport Soccer 2027", isExternal: false, publishedAt: new Date() });
  res.status(201).json(created);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const { title, summary, body, image } = req.body;
  const updated = await News.findByIdAndUpdate(req.params.id, { title, summary, body, image }, { new: true });
  if (!updated) return res.status(404).json({ error: "not_found" });
  res.json(updated);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const deleted = await News.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "not_found" });
  res.json({ ok: true });
});

export default router;