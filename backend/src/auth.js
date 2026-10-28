import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import db from "./db.js";

const isProd = process.env.NODE_ENV === "production";
let SECRET = process.env.JWT_SECRET;
if (!SECRET || SECRET.length < 32) {
  if (isProd) throw new Error("JWT_SECRET must be set (32+ characters) in production.");
  SECRET = crypto.randomBytes(48).toString("hex");
  console.warn("JWT_SECRET not set: using a temporary one. Everyone is logged out when the server restarts.");
}

const COOKIE = "token";
const MAX_AGE_MS = 8 * 60 * 60 * 1000; // one shift
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12); // keeps timing similar for unknown emails

export function requireAuth(req, res, next) {
  const token = req.cookies[COOKIE];
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

export const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ error: "You do not have permission to do this." });

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
});

const publicUser = (u) => ({ id: u.sub ?? u.id, email: u.email, name: u.name, role: u.role });

export const router = Router();

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return res.status(400).json({ error: "Enter your email and password." });
  }
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.trim().toLowerCase());
  const ok = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !ok) return res.status(401).json({ error: "Incorrect email or password." });

  const token = jwt.sign({ sub: user.id, email: user.email, name: user.name, role: user.role }, SECRET, { expiresIn: "8h" });
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: isProd, maxAge: MAX_AGE_MS });
  res.json({ user: publicUser(user) });
});

router.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE, { httpOnly: true, sameSite: "lax", secure: isProd });
  res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));
