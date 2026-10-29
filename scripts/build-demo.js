"use strict";
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "dist");
fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(path.join(root, "public"), out, { recursive: true });

const baseTime = 1793254976948;
const offset = Date.now() - baseTime;
function shift(value) {
  if (Array.isArray(value)) return value.map(shift);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shift(v)]));
  return typeof value === "number" && value > 1_700_000_000_000 && value < 2_000_000_000_000 ? value + offset : value;
}
const fixtures = {};
for (const name of ["state", "perf", "docs", "hopthu", "tongquan"]) {
  fixtures[name] = shift(JSON.parse(fs.readFileSync(path.join(root, "demo", "fixtures", name + ".json"), "utf8")));
}
const now = Date.now();
const examples = [
  { key: "c-demo0001", name: "Quản lý", role: "Quản lý dự án", platform: "claude", room: "manager", status: "active", lastText: "Đang chia việc và kiểm tra tiến độ." },
  { key: "c-demo0002", name: "Điều phối", role: "Điều phối", platform: "claude", room: "coord", status: "idle", lastText: "Đã sắp xếp hàng chờ DEV." },
  { key: "x-demo0003", name: "Kỹ sư Codex", role: "Kỹ sư Codex", platform: "codex", room: "codex", status: "active", lastText: "Đang hoàn thiện giao diện." },
];
for (const [i, e] of examples.entries()) {
  const agent = { ...fixtures.state.agents[0], ...e, where: e.room, flag: null, session: `demo000${i + 1}`, host: null,
    lastTextAt: now - (i + 1) * 30000, lastActive: now - (i + 1) * 30000,
    createdAt: now - 3600000, hasJournal: true, isNew: false, hist: Array(60).fill(0).map((_, j) => j > 44 ? (i === 1 ? 0 : 1) : 0) };
  fixtures.state.agents.push(agent);
}
fixtures.state.subtitle = "Bản demo · dữ liệu minh họa";
fixtures.docs.agents = fixtures.state.agents.map(({ key, name, session, host, status, room, platform, role }) => ({ key, name, session, host, status, room, platform, role }));
fixtures.state.team = fixtures.state.team.map((row, i) => ({ ...row, n: i > 155 ? 2 : 0, codex: i > 155 ? 1 : 0, claude: i > 155 ? 1 : 0 }));
for (const [name, value] of Object.entries(fixtures)) fs.writeFileSync(path.join(out, name + ".json"), JSON.stringify(value));
fs.mkdirSync(path.join(out, "chat"), { recursive: true });
fs.writeFileSync(path.join(out, "chat", "status.json"), JSON.stringify({ authorized: false, msg: "Bản demo không gửi tin nhắn." }));

for (const file of fs.readdirSync(out).filter((x) => x.endsWith(".html"))) {
  const p = path.join(out, file);
  fs.writeFileSync(p, fs.readFileSync(p, "utf8")
    .replaceAll("TRỰC TIẾP", "BẢN DEMO")
    .replaceAll("trực tiếp", "bản demo")
    .replaceAll("fetch(\"state\"", "fetch(\"state.json\"")
    .replaceAll("fetch(\"perf\"", "fetch(\"perf.json\"")
    .replaceAll("fetch(\"docs\"", "fetch(\"docs.json\"")
    .replaceAll("fetch(\"hopthu\"", "fetch(\"hopthu.json\"")
    .replaceAll("fetch(\"tongquan\"", "fetch(\"tongquan.json\""));
}
const chat = path.join(out, "chat-ui.js");
fs.writeFileSync(chat, fs.readFileSync(chat, "utf8").replaceAll('fetch("chat/status"', 'fetch("chat/status.json"'));
console.log("Đã tạo bản demo tĩnh trong dist/");
