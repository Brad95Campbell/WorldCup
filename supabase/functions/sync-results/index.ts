// =====================================================================
// sync-results  —  Supabase Edge Function
//
// Runs on a schedule. Fetches FINISHED FIFA World Cup matches from
// football-data.org (free tier), decides the winner (or 'draw'), and
// writes them into the public.results table. Your website is subscribed
// to that table, so every visitor's standings update automatically.
//
// It identifies each match by (date + the two team names), then looks up
// YOUR internal match id from the MATCHES list baked in below, so the row
// it writes lines up with what the site already knows.
// =====================================================================

import { createClient } from "jsr:@supabase/supabase-js@2";

// ---- your match schedule (id + date + the two teams, names as the site uses) ----
// Only id/date/teams are needed here for matching; times/odds live in the front-end.
const MATCHES = [
  { id: 1, date: "2026-06-11", team1: "Mexico", team2: "South Africa" },
  { id: 2, date: "2026-06-11", team1: "Korea Republic", team2: "Czechia" },
  { id: 3, date: "2026-06-12", team1: "Canada", team2: "Bosnia and Herzegovina" },
  { id: 4, date: "2026-06-12", team1: "USA", team2: "Paraguay" },
  { id: 5, date: "2026-06-13", team1: "Qatar", team2: "Switzerland" },
  { id: 6, date: "2026-06-13", team1: "Brazil", team2: "Morocco" },
  { id: 7, date: "2026-06-13", team1: "Haiti", team2: "Scotland" },
  { id: 8, date: "2026-06-13", team1: "Australia", team2: "Türkiye" },
  { id: 9, date: "2026-06-14", team1: "Germany", team2: "Curaçao" },
  { id: 10, date: "2026-06-14", team1: "Netherlands", team2: "Japan" },
  { id: 11, date: "2026-06-14", team1: "Côte d'Ivoire", team2: "Ecuador" },
  { id: 12, date: "2026-06-14", team1: "Sweden", team2: "Tunisia" },
  { id: 13, date: "2026-06-15", team1: "Spain", team2: "Cabo Verde" },
  { id: 14, date: "2026-06-15", team1: "Belgium", team2: "Egypt" },
  { id: 15, date: "2026-06-15", team1: "Saudi Arabia", team2: "Uruguay" },
  { id: 16, date: "2026-06-15", team1: "Iran", team2: "New Zealand" },
  { id: 17, date: "2026-06-16", team1: "France", team2: "Senegal" },
  { id: 18, date: "2026-06-16", team1: "Iraq", team2: "Norway" },
  { id: 19, date: "2026-06-16", team1: "Argentina", team2: "Algeria" },
  { id: 20, date: "2026-06-16", team1: "Austria", team2: "Jordan" },
  { id: 21, date: "2026-06-17", team1: "Portugal", team2: "Uruguay" },
  { id: 22, date: "2026-06-17", team1: "England", team2: "Croatia" },
  { id: 23, date: "2026-06-17", team1: "Panama", team2: "Colombia" },
  { id: 24, date: "2026-06-17", team1: "Uzbekistan", team2: "Ghana" },
  { id: 25, date: "2026-06-18", team1: "Czechia", team2: "South Africa" },
  { id: 26, date: "2026-06-18", team1: "Mexico", team2: "Korea Republic" },
  { id: 27, date: "2026-06-18", team1: "Switzerland", team2: "Bosnia and Herzegovina" },
  { id: 28, date: "2026-06-18", team1: "Canada", team2: "Qatar" },
  { id: 29, date: "2026-06-19", team1: "Morocco", team2: "Paraguay" },
  { id: 30, date: "2026-06-19", team1: "Türkiye", team2: "USA" },
  { id: 31, date: "2026-06-19", team1: "Curaçao", team2: "Ecuador" },
  { id: 32, date: "2026-06-19", team1: "Japan", team2: "Tunisia" },
  { id: 33, date: "2026-06-20", team1: "Scotland", team2: "Haiti" },
  { id: 34, date: "2026-06-20", team1: "Brazil", team2: "Australia" },
  { id: 35, date: "2026-06-20", team1: "Germany", team2: "Denmark" },
  { id: 36, date: "2026-06-20", team1: "Netherlands", team2: "Côte d'Ivoire" },
  { id: 37, date: "2026-06-21", team1: "Spain", team2: "Saudi Arabia" },
  { id: 38, date: "2026-06-21", team1: "Belgium", team2: "Iran" },
  { id: 39, date: "2026-06-21", team1: "Uruguay", team2: "Cabo Verde" },
  { id: 40, date: "2026-06-21", team1: "New Zealand", team2: "Egypt" },
  { id: 41, date: "2026-06-22", team1: "Argentina", team2: "Austria" },
  { id: 42, date: "2026-06-22", team1: "France", team2: "Iraq" },
  { id: 43, date: "2026-06-22", team1: "Norway", team2: "Senegal" },
  { id: 44, date: "2026-06-22", team1: "Jordan", team2: "Algeria" },
  { id: 45, date: "2026-06-23", team1: "Portugal", team2: "Uzbekistan" },
  { id: 46, date: "2026-06-23", team1: "England", team2: "Ghana" },
  { id: 47, date: "2026-06-23", team1: "Panama", team2: "Croatia" },
  { id: 48, date: "2026-06-23", team1: "Colombia", team2: "DR Congo" },
  { id: 49, date: "2026-06-24", team1: "Switzerland", team2: "Canada" },
  { id: 50, date: "2026-06-24", team1: "Bosnia and Herzegovina", team2: "Qatar" },
  { id: 51, date: "2026-06-24", team1: "Scotland", team2: "Brazil" },
  { id: 52, date: "2026-06-24", team1: "Morocco", team2: "Haiti" },
  { id: 53, date: "2026-06-24", team1: "Czechia", team2: "Mexico" },
  { id: 54, date: "2026-06-24", team1: "South Africa", team2: "Korea Republic" },
  { id: 55, date: "2026-06-25", team1: "Ecuador", team2: "Germany" },
  { id: 56, date: "2026-06-25", team1: "Curaçao", team2: "Côte d'Ivoire" },
  { id: 57, date: "2026-06-25", team1: "Japan", team2: "Sweden" },
  { id: 58, date: "2026-06-25", team1: "Tunisia", team2: "Netherlands" },
  { id: 59, date: "2026-06-25", team1: "Türkiye", team2: "USA" },
  { id: 60, date: "2026-06-25", team1: "Paraguay", team2: "Australia" },
  { id: 61, date: "2026-06-26", team1: "Norway", team2: "France" },
  { id: 62, date: "2026-06-26", team1: "Senegal", team2: "Iraq" },
  { id: 63, date: "2026-06-26", team1: "Cabo Verde", team2: "Egypt" },
  { id: 64, date: "2026-06-26", team1: "Saudi Arabia", team2: "New Zealand" },
  { id: 65, date: "2026-06-26", team1: "Algeria", team2: "Austria" },
  { id: 66, date: "2026-06-26", team1: "Jordan", team2: "Argentina" },
  { id: 67, date: "2026-06-27", team1: "Colombia", team2: "Ghana" },
  { id: 68, date: "2026-06-27", team1: "DR Congo", team2: "Uzbekistan" },
  { id: 69, date: "2026-06-27", team1: "England", team2: "Panama" },
  { id: 70, date: "2026-06-27", team1: "Croatia", team2: "Montenegro" },
  { id: 71, date: "2026-06-27", team1: "Portugal", team2: "Denmark" },
  { id: 72, date: "2026-06-27", team1: "Iceland", team2: "Germany" },
];

// football-data.org sometimes spells nations differently than our site.
// Map THEIR name -> OUR name. Add entries here if the logs show "unmatched".
const NAME_ALIASES: Record<string, string> = {
  "United States": "USA",
  "Turkey": "Türkiye",
  "Türkiye": "Türkiye",
  "South Korea": "Korea Republic",
  "Korea Republic": "Korea Republic",
  "Ivory Coast": "Côte d'Ivoire",
  "Côte d'Ivoire": "Côte d'Ivoire",
  "Cape Verde": "Cabo Verde",
  "Cabo Verde": "Cabo Verde",
  "Curacao": "Curaçao",
  "Curaçao": "Curaçao",
  "DR Congo": "DR Congo",
  "Congo DR": "DR Congo",
  "Democratic Republic of the Congo": "DR Congo",
  "Bosnia & Herzegovina": "Bosnia and Herzegovina",
  "Bosnia-Herzegovina": "Bosnia and Herzegovina",
};

// Normalize any incoming name to our canonical spelling.
function canonical(name: string): string {
  if (!name) return "";
  if (NAME_ALIASES[name]) return NAME_ALIASES[name];
  // strip accents and lowercase for a looser fallback compare
  return name;
}

// loose compare: accent-insensitive, case-insensitive
function loose(a: string): string {
  return a.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Find our internal match id for a finished API match.
function findMatchId(dateISO: string, homeRaw: string, awayRaw: string): number | null {
  const date = dateISO.slice(0, 10); // YYYY-MM-DD
  const home = canonical(homeRaw);
  const away = canonical(awayRaw);

  for (const m of MATCHES) {
    // allow a +/- 1 day window because of timezone differences between
    // the API's UTC kickoff date and our listed local date.
    const sameTeams =
      (loose(m.team1) === loose(home) && loose(m.team2) === loose(away)) ||
      (loose(m.team1) === loose(away) && loose(m.team2) === loose(home));
    if (!sameTeams) continue;

    const d = new Date(m.date).getTime();
    const apiD = new Date(date).getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    if (Math.abs(d - apiD) <= dayMs) return m.id;
  }
  return null;
}

Deno.serve(async () => {
  const FD_TOKEN = Deno.env.get("FOOTBALL_DATA_TOKEN");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!FD_TOKEN || !SUPABASE_URL || !SERVICE_KEY) {
    return new Response(JSON.stringify({ error: "Missing environment variables" }), { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // Find which matches were set manually — we must not overwrite those.
  const { data: lockedRows } = await supabase
    .from("results")
    .select("match_id")
    .eq("locked", true);
  const lockedIds = new Set((lockedRows ?? []).map((r: { match_id: number }) => r.match_id));

  // Fetch all FINISHED World Cup matches.
  // WC = FIFA World Cup competition code on football-data.org.
  const res = await fetch(
    "https://api.football-data.org/v4/competitions/WC/matches?status=FINISHED",
    { headers: { "X-Auth-Token": FD_TOKEN } },
  );

  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: "football-data.org error", status: res.status, text }), { status: 502 });
  }

  const json = await res.json();
  const apiMatches = json.matches ?? [];

  const rows: { match_id: number; winner: string; locked: boolean }[] = [];
  const unmatched: string[] = [];

  for (const am of apiMatches) {
    const home = am.homeTeam?.name ?? "";
    const away = am.awayTeam?.name ?? "";
    const utcDate = am.utcDate ?? "";
    const id = findMatchId(utcDate, home, away);

    if (id === null) {
      unmatched.push(`${home} vs ${away} (${utcDate.slice(0, 10)})`);
      continue;
    }

    // Respect manual overrides: never overwrite a locked row.
    if (lockedIds.has(id)) continue;

    // Decide winner from the score. football-data uses winner: HOME_TEAM / AWAY_TEAM / DRAW
    const w = am.score?.winner;
    let winner: string | null = null;
    if (w === "DRAW") {
      winner = "draw";
    } else if (w === "HOME_TEAM") {
      winner = canonical(home);
    } else if (w === "AWAY_TEAM") {
      winner = canonical(away);
    }

    if (winner) rows.push({ match_id: id, winner, locked: false });
  }

  let upserted = 0;
  if (rows.length > 0) {
    const { error } = await supabase
      .from("results")
      .upsert(rows, { onConflict: "match_id" });
    if (error) {
      return new Response(JSON.stringify({ error: error.message, unmatched }), { status: 500 });
    }
    upserted = rows.length;
  }

  return new Response(
    JSON.stringify({ ok: true, upserted, unmatched }),
    { headers: { "Content-Type": "application/json" } },
  );
});
