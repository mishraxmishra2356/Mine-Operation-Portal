import { Router } from "express";
import db, { RISKS, HAZARD_STATUSES, EQUIPMENT_STATUSES } from "./db.js";
import { requireAuth, requireRole } from "./auth.js";

const router = Router();
router.use(requireAuth);

const SAFETY_WRITERS = requireRole("admin", "supervisor", "safety_officer");
const OPS_WRITERS = requireRole("admin", "supervisor");
const text = (v, max) => typeof v === "string" && v.trim().length > 0 && v.length <= max;

router.get("/dashboard/summary", (_req, res) => {
  const shifts = db
    .prepare("SELECT name, tonnes FROM shifts WHERE shift_date = (SELECT MAX(shift_date) FROM shifts) ORDER BY id")
    .all();
  const fleet = db
    .prepare("SELECT COUNT(*) AS total, SUM(status != 'Maintenance') AS active FROM equipment")
    .get();
  const openHazards = db.prepare("SELECT COUNT(*) c FROM hazards WHERE status != 'Resolved'").get().c;
  const lti = db.prepare("SELECT value FROM settings WHERE key = 'last_lti_date'").get();
  const ltiFreeDays = lti ? Math.max(0, Math.floor((Date.now() - new Date(lti.value).getTime()) / 86400000)) : null;

  res.json({
    totalTonnes: shifts.reduce((s, x) => s + x.tonnes, 0),
    shifts,
    fleet: { active: fleet.active ?? 0, total: fleet.total },
    openHazards,
    ltiFreeDays,
  });
});

router.get("/production/benches", (_req, res) => res.json(db.prepare("SELECT * FROM benches ORDER BY id").all()));

router.get("/equipment", (_req, res) => res.json(db.prepare("SELECT * FROM equipment ORDER BY id").all()));

router.patch("/equipment/:id", OPS_WRITERS, (req, res) => {
  const { status } = req.body ?? {};
  if (!EQUIPMENT_STATUSES.includes(status)) return res.status(400).json({ error: `status must be one of: ${EQUIPMENT_STATUSES.join(", ")}` });
  const r = db.prepare("UPDATE equipment SET status = ? WHERE id = ?").run(status, req.params.id);
  if (!r.changes) return res.status(404).json({ error: "Equipment not found" });
  res.json(db.prepare("SELECT * FROM equipment WHERE id = ?").get(req.params.id));
});

router.get("/hazards", (_req, res) => res.json(db.prepare("SELECT * FROM hazards ORDER BY created_at DESC, id DESC").all()));

router.post("/hazards", SAFETY_WRITERS, (req, res) => {
  const { area, hazard, risk, action } = req.body ?? {};
  if (!text(area, 120) || !text(hazard, 300) || !RISKS.includes(risk) || (action != null && !text(action, 300))) {
    return res.status(400).json({ error: "area, hazard, risk (Low/Medium/High) are required; action is optional." });
  }
  const create = () => {
    db.exec("BEGIN IMMEDIATE");
    try {
      const last = db.prepare("SELECT MAX(CAST(SUBSTR(id, 4) AS INTEGER)) n FROM hazards").get().n ?? 0;
      const id = `HZ-${last + 1}`;
      db.prepare("INSERT INTO hazards (id, area, hazard, risk, action, status) VALUES (?,?,?,?,?,'Pending')")
        .run(id, area.trim(), hazard.trim(), risk, action?.trim() ?? null);
      db.exec("COMMIT");
      return id;
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  };
  res.status(201).json(db.prepare("SELECT * FROM hazards WHERE id = ?").get(create()));
});

router.patch("/hazards/:id", SAFETY_WRITERS, (req, res) => {
  const { status } = req.body ?? {};
  if (!HAZARD_STATUSES.includes(status)) return res.status(400).json({ error: `status must be one of: ${HAZARD_STATUSES.join(", ")}` });
  const r = db.prepare("UPDATE hazards SET status = ? WHERE id = ?").run(status, req.params.id);
  if (!r.changes) return res.status(404).json({ error: "Hazard not found" });
  res.json(db.prepare("SELECT * FROM hazards WHERE id = ?").get(req.params.id));
});

export default router;
