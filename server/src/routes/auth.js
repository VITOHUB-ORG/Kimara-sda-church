import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/Admin.js";
import RefreshToken from "../models/RefreshToken.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS, 10) || 7;
const REFRESH_TOKEN_MS = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;

// Simple in-memory login rate limiter (per IP). Fine for a single instance;
// swap for a distributed store if the API is ever horizontally scaled.
const loginAttempts = new Map();

const loginRateLimit = (req, res, next) => {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = 10;
  const entry = loginAttempts.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  loginAttempts.set(key, entry);

  // Opportunistic cleanup so the map never grows unbounded.
  if (loginAttempts.size > 1000) {
    for (const [k, e] of loginAttempts) {
      if (now > e.resetAt) loginAttempts.delete(k);
    }
  }

  if (entry.count > max) {
    return res
      .status(429)
      .json({ message: "Too many login attempts. Please try again later." });
  }
  next();
};

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const signAccessToken = (admin) =>
  jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );

const createRefreshToken = async (admin, req) => {
  const raw = crypto.randomBytes(48).toString("hex");
  await RefreshToken.create({
    admin: admin._id,
    tokenHash: hashToken(raw),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_MS),
    userAgent: (req.headers["user-agent"] || "").slice(0, 300),
    ip: req.ip || req.socket?.remoteAddress || "",
  });
  return raw;
};

const revokeRefreshToken = async (token, replacedBy = null) => {
  if (!token) return;
  const doc = await RefreshToken.findOneAndUpdate(
    { tokenHash: hashToken(token), revokedAt: null },
    { revokedAt: new Date(), replacedBy }
  );
  return doc;
};

const publicAdmin = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
});

router.post("/login", loginRateLimit, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: (email || "").toLowerCase() });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken(admin);
    const refreshToken = await createRefreshToken(admin, req);

    res.json({ accessToken, refreshToken, admin: publicAdmin(admin) });
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    const doc = await RefreshToken.findOne({
      tokenHash: hashToken(refreshToken),
      revokedAt: null,
    });

    if (!doc) return res.status(401).json({ message: "Session expired, please log in again" });
    if (doc.expiresAt < new Date()) {
      await RefreshToken.updateOne({ _id: doc._id }, { revokedAt: new Date() });
      return res.status(401).json({ message: "Session expired, please log in again" });
    }

    const admin = await Admin.findById(doc.admin);
    if (!admin) return res.status(401).json({ message: "Session expired, please log in again" });

    // Rotate: revoke the used token and issue a fresh pair.
    const newRefreshToken = await createRefreshToken(admin, req);
    await revokeRefreshToken(refreshToken, doc._id);

    res.json({ accessToken: signAccessToken(admin), refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await revokeRefreshToken(refreshToken);
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Not found" });
    res.json(admin);
  } catch (err) {
    next(err);
  }
});

export default router;
