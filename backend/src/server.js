import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { router as authRouter } from "./auth.js";
import api from "./routes.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1); // behind the hosting platform's proxy (needed for HTTPS cookies + rate limiting)
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api", api);

// Serve the built React app (frontend/dist) from this same server, so one URL does everything.
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../frontend/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status === 400 ? 400 : 500).json({ error: err.status === 400 ? "Invalid request body" : "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`MineSafe API running on http://localhost:${PORT}`));
