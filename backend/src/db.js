import { DatabaseSync } from "node:sqlite"; // built into Node 22.13+, no native build needed
import bcrypt from "bcryptjs";

const db = new DatabaseSync(process.env.DB_PATH || "mine.db");
db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");

export const ROLES = ["admin", "supervisor", "safety_officer", "operator"];
export const RISKS = ["Low", "Medium", "High"];
export const HAZARD_STATUSES = ["Pending", "Active Control", "Resolved"];
export const EQUIPMENT_STATUSES = ["Operating", "Hauling", "Dumping", "Spreading", "Idle", "Maintenance"];

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('admin','supervisor','safety_officer','operator'))
);
CREATE TABLE IF NOT EXISTS shifts (
  id INTEGER PRIMARY KEY, shift_date TEXT NOT NULL, name TEXT NOT NULL, tonnes REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS benches (
  id TEXT PRIMARY KEY, bench TEXT NOT NULL, material TEXT NOT NULL, unit TEXT NOT NULL, target REAL NOT NULL, actual REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS equipment (
  id TEXT PRIMARY KEY, type TEXT NOT NULL, location TEXT, operator TEXT, fuel TEXT, status TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS hazards (
  id TEXT PRIMARY KEY, area TEXT NOT NULL, hazard TEXT NOT NULL,
  risk TEXT NOT NULL CHECK (risk IN ('Low','Medium','High')), action TEXT,
  status TEXT NOT NULL CHECK (status IN ('Pending','Active Control','Resolved')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
`);

function seed() {
  // In production, demo accounts are only created if you explicitly opt in with SEED_DEMO=true.
  if (process.env.NODE_ENV === "production" && process.env.SEED_DEMO !== "true") return;
  if (db.prepare("SELECT COUNT(*) c FROM users").get().c > 0) return;

  const hash = bcrypt.hashSync("Demo@12345", 12);
  const addUser = db.prepare("INSERT INTO users (email, name, password_hash, role) VALUES (?,?,?,?)");
  addUser.run("admin@mine.com", "Admin", hash, "admin");
  addUser.run("supervisor@mine.com", "Shift Supervisor", hash, "supervisor");
  addUser.run("operator@mine.com", "Operator", hash, "operator");

  const today = new Date().toISOString().slice(0, 10);
  const addShift = db.prepare("INSERT INTO shifts (shift_date, name, tonnes) VALUES (?,?,?)");
  [["Shift A (Morning)", 14200], ["Shift B (Evening)", 12800], ["Shift C (Night)", 9500]].forEach(([n, t]) => addShift.run(today, n, t));

  const addBench = db.prepare("INSERT INTO benches VALUES (?,?,?,?,?,?)");
  [
    ["B1", "Bench 1 (Top Overburden)", "Sandstone / OB", "m³", 18000, 17400],
    ["B2", "Bench 2 (Mid Overburden)", "Shale", "m³", 12000, 12800],
    ["B3", "Bench 3 (Coal Seam Top)", "Grade G-11 Coal", "T", 20000, 19200],
    ["B4", "Bench 4 (Coal Seam Bottom)", "Grade G-9 Coal", "T", 16500, 17300],
  ].forEach((r) => addBench.run(...r));

  const addEq = db.prepare("INSERT INTO equipment VALUES (?,?,?,?,?,?)");
  [
    ["SH-01", "Electric Rope Shovel (20m³)", "Bench 3 Coal", "R. Sharma", "94% Grid", "Operating"],
    ["SH-02", "Hydraulic Excavator (12m³)", "Bench 1 OB", "V. Kumar", "78% Diesel", "Operating"],
    ["DT-101", "CAT 777E Dumper (100T)", "Haul Road North", "A. Singh", "65%", "Hauling"],
    ["DT-104", "CAT 777E Dumper (100T)", "Pit Crusher Hopper", "M. Patel", "82%", "Dumping"],
    ["DZ-05", "Crawler Dozer (D375A)", "OB Dump Yard 2", "K. Das", "40%", "Spreading"],
    ["DT-108", "CAT 777E Dumper (100T)", "Central Workshop", "—", "—", "Maintenance"],
  ].forEach((r) => addEq.run(...r));

  const addHz = db.prepare("INSERT INTO hazards (id, area, hazard, risk, action, status) VALUES (?,?,?,?,?,?)");
  [
    ["HZ-401", "Highwall Sector 2B", "Tension crack detected by SSR radar", "Medium", "15m berm setback enforced", "Active Control"],
    ["HZ-398", "Haul Road Ramp 3", "Excessive fugitive dust reducing visibility", "Low", "Water bowsers dispatched", "Resolved"],
    ["HZ-395", "Substation 33kV", "Earthing pit resistance check due", "Low", "Electrical safety audit booked", "Pending"],
  ].forEach((r) => addHz.run(...r));

  const lastLti = new Date(Date.now() - 142 * 86400000).toISOString().slice(0, 10);
  db.prepare("INSERT INTO settings VALUES ('last_lti_date', ?)").run(lastLti);
  console.log("Seeded demo data. Demo logins: admin@mine.com / supervisor@mine.com / operator@mine.com, password Demo@12345");
}
seed();

export default db;
