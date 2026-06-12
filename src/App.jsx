import React, { useState, useEffect } from 'react';
import { supabase, functionsUrl, anonKey } from './supabaseClient';

const COUNTRY_FLAGS = {
  'Mexico': '🇲🇽', 'South Africa': '🇿🇦', 'Korea Republic': '🇰🇷', 'Czechia': '🇨🇿',
  'Canada': '🇨🇦', 'Bosnia and Herzegovina': '🇧🇦', 'USA': '🇺🇸', 'Paraguay': '🇵🇾',
  'Qatar': '🇶🇦', 'Switzerland': '🇨🇭', 'Brazil': '🇧🇷', 'Morocco': '🇲🇦',
  'Haiti': '🇭🇹', 'Scotland': '🇬🇧', 'Australia': '🇦🇺', 'Türkiye': '🇹🇷',
  'Germany': '🇩🇪', 'Curaçao': '🇨🇼', 'Netherlands': '🇳🇱', 'Japan': '🇯🇵',
  "Côte d'Ivoire": '🇨🇮', 'Ecuador': '🇪🇨', 'Sweden': '🇸🇪', 'Tunisia': '🇹🇳',
  'Spain': '🇪🇸', 'Cabo Verde': '🇨🇻', 'Belgium': '🇧🇪', 'Egypt': '🇪🇬',
  'Saudi Arabia': '🇸🇦', 'Uruguay': '🇺🇾', 'Iran': '🇮🇷', 'New Zealand': '🇳🇿',
  'France': '🇫🇷', 'Senegal': '🇸🇳', 'Iraq': '🇮🇶', 'Norway': '🇳🇴',
  'Argentina': '🇦🇷', 'Algeria': '🇩🇿', 'Austria': '🇦🇹', 'Jordan': '🇯🇴',
  'Portugal': '🇵🇹', 'England': '🇬🇧', 'Panama': '🇵🇦', 'Colombia': '🇨🇴',
  'Uzbekistan': '🇺🇿', 'Ghana': '🇬🇭', 'DR Congo': '🇨🇩', 'Croatia': '🇭🇷',
  'Denmark': '🇩🇰', 'Iceland': '🇮🇸', 'Montenegro': '🇲🇪'
};

const PLAYERS = [
  { id: 1, name: 'Kev C', teams: ['Qatar', 'Tunisia', 'Paraguay', 'Norway', 'France'] },
  { id: 2, name: 'Andy', teams: ['Uzbekistan', 'Australia', 'Senegal', 'Türkiye', 'Argentina'] },
  { id: 3, name: 'Brad', teams: ['Jordan', 'Algeria', 'Croatia', 'Morocco', 'Portugal'] },
  { id: 4, name: 'Matt C', teams: ['South Africa', 'Korea Republic', 'Ecuador', 'Japan', 'Netherlands'] },
  { id: 5, name: 'Tommy', teams: ['DR Congo', 'Bosnia and Herzegovina', 'Sweden', 'Switzerland', 'Belgium'] },
  { id: 6, name: 'Mike', teams: ['Cabo Verde', 'Iran', "Côte d'Ivoire", 'Mexico', 'England'] },
  { id: 7, name: 'RJ', teams: ['Saudi Arabia', 'Egypt', 'Canada', 'Colombia', 'Spain'] },
  { id: 8, name: 'Tyler', teams: ['Panama', 'Ghana', 'Czechia', 'USA', 'Germany'] },
  { id: 9, name: 'Joe', teams: ['New Zealand', 'Scotland', 'Austria', 'Uruguay', 'Brazil'] },
  { id: 10, name: 'Kev R', teams: ['Haiti', 'Iraq', 'Curaçao'] },
];

const MATCHES = [
  { id: 1, date: '2026-06-11', time: '3:00 PM ET', team1: 'Mexico', team2: 'South Africa' },
  { id: 2, date: '2026-06-11', time: '10:00 PM ET', team1: 'Korea Republic', team2: 'Czechia' },
  { id: 3, date: '2026-06-12', time: '3:00 PM ET', team1: 'Canada', team2: 'Bosnia and Herzegovina' },
  { id: 4, date: '2026-06-12', time: '9:00 PM ET', team1: 'USA', team2: 'Paraguay' },
  { id: 5, date: '2026-06-13', time: '3:00 PM ET', team1: 'Qatar', team2: 'Switzerland' },
  { id: 6, date: '2026-06-13', time: '6:00 PM ET', team1: 'Brazil', team2: 'Morocco' },
  { id: 7, date: '2026-06-13', time: '9:00 PM ET', team1: 'Haiti', team2: 'Scotland' },
  { id: 8, date: '2026-06-14', time: '12:00 AM ET', team1: 'Australia', team2: 'Türkiye' },
  { id: 9, date: '2026-06-14', time: '1:00 PM ET', team1: 'Germany', team2: 'Curaçao' },
  { id: 10, date: '2026-06-14', time: '4:00 PM ET', team1: 'Netherlands', team2: 'Japan' },
  { id: 11, date: '2026-06-14', time: '7:00 PM ET', team1: "Côte d'Ivoire", team2: 'Ecuador' },
  { id: 12, date: '2026-06-14', time: '10:00 PM ET', team1: 'Sweden', team2: 'Tunisia' },
  { id: 13, date: '2026-06-15', time: '12:00 PM ET', team1: 'Spain', team2: 'Cabo Verde' },
  { id: 14, date: '2026-06-15', time: '3:00 PM ET', team1: 'Belgium', team2: 'Egypt' },
  { id: 15, date: '2026-06-15', time: '6:00 PM ET', team1: 'Saudi Arabia', team2: 'Uruguay' },
  { id: 16, date: '2026-06-15', time: '9:00 PM ET', team1: 'Iran', team2: 'New Zealand' },
  { id: 17, date: '2026-06-16', time: '3:00 PM ET', team1: 'France', team2: 'Senegal' },
  { id: 18, date: '2026-06-16', time: '6:00 PM ET', team1: 'Iraq', team2: 'Norway' },
  { id: 19, date: '2026-06-16', time: '9:00 PM ET', team1: 'Argentina', team2: 'Algeria' },
  { id: 20, date: '2026-06-17', time: '12:00 AM ET', team1: 'Austria', team2: 'Jordan' },
  { id: 21, date: '2026-06-17', time: '1:00 PM ET', team1: 'Portugal', team2: 'DR Congo' },
  { id: 22, date: '2026-06-17', time: '4:00 PM ET', team1: 'England', team2: 'Croatia' },
  { id: 23, date: '2026-06-17', time: '7:00 PM ET', team1: 'Ghana', team2: 'Panama' },
  { id: 24, date: '2026-06-17', time: '10:00 PM ET', team1: 'Uzbekistan', team2: 'Colombia' },
  { id: 25, date: '2026-06-18', time: '12:00 PM ET', team1: 'Czechia', team2: 'South Africa' },
  { id: 26, date: '2026-06-18', time: '3:00 PM ET', team1: 'Switzerland', team2: 'Bosnia and Herzegovina' },
  { id: 27, date: '2026-06-18', time: '6:00 PM ET', team1: 'Canada', team2: 'Qatar' },
  { id: 28, date: '2026-06-18', time: '9:00 PM ET', team1: 'Mexico', team2: 'Korea Republic' },
  { id: 29, date: '2026-06-19', time: '3:00 PM ET', team1: 'USA', team2: 'Australia' },
  { id: 30, date: '2026-06-19', time: '6:00 PM ET', team1: 'Scotland', team2: 'Morocco' },
  { id: 31, date: '2026-06-19', time: '8:30 PM ET', team1: 'Brazil', team2: 'Haiti' },
  { id: 32, date: '2026-06-19', time: '11:00 PM ET', team1: 'Türkiye', team2: 'Paraguay' },
  { id: 33, date: '2026-06-20', time: '1:00 PM ET', team1: 'Netherlands', team2: 'Sweden' },
  { id: 34, date: '2026-06-20', time: '4:00 PM ET', team1: 'Germany', team2: "Côte d'Ivoire" },
  { id: 35, date: '2026-06-20', time: '8:00 PM ET', team1: 'Ecuador', team2: 'Curaçao' },
  { id: 36, date: '2026-06-21', time: '12:00 AM ET', team1: 'Tunisia', team2: 'Japan' },
  { id: 37, date: '2026-06-21', time: '12:00 PM ET', team1: 'Spain', team2: 'Saudi Arabia' },
  { id: 38, date: '2026-06-21', time: '3:00 PM ET', team1: 'Belgium', team2: 'Iran' },
  { id: 39, date: '2026-06-21', time: '6:00 PM ET', team1: 'Uruguay', team2: 'Cabo Verde' },
  { id: 40, date: '2026-06-21', time: '9:00 PM ET', team1: 'New Zealand', team2: 'Egypt' },
  { id: 41, date: '2026-06-22', time: '1:00 PM ET', team1: 'Argentina', team2: 'Austria' },
  { id: 42, date: '2026-06-22', time: '5:00 PM ET', team1: 'France', team2: 'Iraq' },
  { id: 43, date: '2026-06-22', time: '8:00 PM ET', team1: 'Norway', team2: 'Senegal' },
  { id: 44, date: '2026-06-22', time: '11:00 PM ET', team1: 'Jordan', team2: 'Algeria' },
  { id: 45, date: '2026-06-23', time: '1:00 PM ET', team1: 'Portugal', team2: 'Uzbekistan' },
  { id: 46, date: '2026-06-23', time: '4:00 PM ET', team1: 'England', team2: 'Ghana' },
  { id: 47, date: '2026-06-23', time: '7:00 PM ET', team1: 'Panama', team2: 'Croatia' },
  { id: 48, date: '2026-06-23', time: '10:00 PM ET', team1: 'Colombia', team2: 'DR Congo' },
  { id: 49, date: '2026-06-24', time: '3:00 PM ET', team1: 'Bosnia and Herzegovina', team2: 'Qatar' },
  { id: 50, date: '2026-06-24', time: '3:00 PM ET', team1: 'Switzerland', team2: 'Canada' },
  { id: 51, date: '2026-06-24', time: '6:00 PM ET', team1: 'Scotland', team2: 'Brazil' },
  { id: 52, date: '2026-06-24', time: '6:00 PM ET', team1: 'Morocco', team2: 'Haiti' },
  { id: 53, date: '2026-06-24', time: '9:00 PM ET', team1: 'South Africa', team2: 'Korea Republic' },
  { id: 54, date: '2026-06-24', time: '9:00 PM ET', team1: 'Czechia', team2: 'Mexico' },
  { id: 55, date: '2026-06-25', time: '4:00 PM ET', team1: 'Ecuador', team2: 'Germany' },
  { id: 56, date: '2026-06-25', time: '4:00 PM ET', team1: 'Curaçao', team2: "Côte d'Ivoire" },
  { id: 57, date: '2026-06-25', time: '7:00 PM ET', team1: 'Tunisia', team2: 'Netherlands' },
  { id: 58, date: '2026-06-25', time: '7:00 PM ET', team1: 'Japan', team2: 'Sweden' },
  { id: 59, date: '2026-06-25', time: '10:00 PM ET', team1: 'Paraguay', team2: 'Australia' },
  { id: 60, date: '2026-06-25', time: '10:00 PM ET', team1: 'Türkiye', team2: 'USA' },
  { id: 61, date: '2026-06-26', time: '3:00 PM ET', team1: 'Norway', team2: 'France' },
  { id: 62, date: '2026-06-26', time: '3:00 PM ET', team1: 'Senegal', team2: 'Iraq' },
  { id: 63, date: '2026-06-26', time: '8:00 PM ET', team1: 'Cabo Verde', team2: 'Saudi Arabia' },
  { id: 64, date: '2026-06-26', time: '8:00 PM ET', team1: 'Uruguay', team2: 'Spain' },
  { id: 65, date: '2026-06-26', time: '11:00 PM ET', team1: 'New Zealand', team2: 'Belgium' },
  { id: 66, date: '2026-06-26', time: '11:00 PM ET', team1: 'Egypt', team2: 'Iran' },
  { id: 67, date: '2026-06-27', time: '5:00 PM ET', team1: 'Panama', team2: 'England' },
  { id: 68, date: '2026-06-27', time: '5:00 PM ET', team1: 'Croatia', team2: 'Ghana' },
  { id: 69, date: '2026-06-27', time: '7:30 PM ET', team1: 'Colombia', team2: 'Portugal' },
  { id: 70, date: '2026-06-27', time: '7:30 PM ET', team1: 'DR Congo', team2: 'Uzbekistan' },
  { id: 71, date: '2026-06-27', time: '10:00 PM ET', team1: 'Jordan', team2: 'Argentina' },
  { id: 72, date: '2026-06-27', time: '10:00 PM ET', team1: 'Algeria', team2: 'Austria' },
];

const MATCH_ODDS = {
  2: { h: 200, t: 105, a: 310 },
  3: { h: -120, t: 240, a: 360 },
  4: { h: -105, t: 240, a: 320 },
  5: { h: 1300, t: 550, a: -500 },
  6: { h: -155, t: 280, a: 470 },
  7: { h: 490, t: 320, a: -180 },
  8: { h: 420, t: 270, a: -145 },
  9: { h: -2000, t: 1700, a: 4000 },
  10: { h: -105, t: 250, a: 270 },
  11: { h: 260, t: 180, a: 145 },
  12: { h: -115, t: 240, a: 340 },
  13: { h: -1000, t: 950, a: 2700 },
  14: { h: -160, t: 290, a: 470 },
  15: { h: 650, t: 340, a: -240 },
  16: { h: -120, t: 240, a: 370 },
  17: { h: -220, t: 340, a: 600 },
  18: { h: 1300, t: 600, a: -550 },
  19: { h: -260, t: 360, a: 750 },
  20: { h: -320, t: 460, a: 850 },
  21: { h: -370, t: 470, a: 1000 },
  22: { h: -140, t: 270, a: 400 },
  23: { h: 115, t: 240, a: 250 },
  24: { h: 850, t: 370, a: -270 },
  25: { h: -150, t: 290, a: 420 },
  26: { h: -170, t: 300, a: 490 },
  27: { h: -330, t: 410, a: 1100 },
  28: { h: -120, t: 250, a: 340 },
  29: { h: -140, t: 280, a: 390 },
  30: { h: 330, t: 230, a: -110 },
  31: { h: -1500, t: 1300, a: 2500 },
  32: { h: 125, t: 220, a: 240 },
  33: { h: -155, t: 300, a: 410 },
  34: { h: -185, t: 320, a: 500 },
  35: { h: -475, t: 550, a: 1200 },
  36: { h: 440, t: 250, a: -140 },
  37: { h: -900, t: 800, a: 2700 },
  38: { h: -250, t: 360, a: 700 },
  39: { h: -240, t: 350, a: 650 },
  40: { h: 420, t: 260, a: -135 },
  41: { h: -155, t: 290, a: 460 },
  42: { h: -800, t: 700, a: 2200 },
  43: { h: 120, t: 240, a: 230 },
  44: { h: 550, t: 310, a: -190 },
  45: { h: -390, t: 500, a: 1000 },
  46: { h: -330, t: 490, a: 800 },
  47: { h: 550, t: 310, a: -190 },
  48: { h: -200, t: 310, a: 600 },
  49: { h: -170, t: 300, a: 480 },
  50: { h: 110, t: 240, a: 260 },
  51: { h: 600, t: 360, a: -240 },
  52: { h: -300, t: 410, a: 900 },
  53: { h: 390, t: 260, a: -135 },
  54: { h: 370, t: 250, a: -125 },
  55: { h: 410, t: 290, a: -145 },
  56: { h: 1300, t: 500, a: -425 },
  57: { h: 550, t: 320, a: -200 },
  58: { h: 105, t: 250, a: 260 },
  59: { h: 110, t: 230, a: 260 },
  60: { h: 170, t: 250, a: 150 },
  61: { h: 350, t: 270, a: -125 },
  62: { h: -240, t: 350, a: 650 },
  63: { h: 150, t: 240, a: 175 },
  64: { h: 440, t: 300, a: -155 },
  65: { h: 1000, t: 460, a: -360 },
  66: { h: 125, t: 210, a: 250 },
  67: { h: 900, t: 500, a: -360 },
  68: { h: -160, t: 290, a: 480 },
  69: { h: 250, t: 240, a: 110 },
  70: { h: 135, t: 220, a: 220 },
  71: { h: 1400, t: 550, a: -550 },
  72: { h: 240, t: 230, a: 120 },
};

const ODDS = {
  'Spain': +450, 'France': +500, 'England': +750, 'Portugal': +800,
  'Brazil': +850, 'Argentina': +950, 'Germany': +1300, 'Netherlands': +1600,
  'Belgium': +2200, 'Norway': +3300, 'Colombia': +3500, 'Mexico': +5000,
  'Morocco': +5000, 'Japan': +5000, 'USA': +5500, 'Uruguay': +6000,
  'Croatia': +7000, 'Switzerland': +7000, 'Türkiye': +7000, 'Ecuador': +8000,
  'Austria': +10000, 'Sweden': +15000, 'Senegal': +15000, "Côte d'Ivoire": +15000,
  'Canada': +17500, 'Scotland': +17500, 'Paraguay': +20000, 'Algeria': +25000,
  'Egypt': +30000, 'Korea Republic': +40000, 'Ghana': +40000,
  'Bosnia and Herzegovina': +50000, 'Czechia': +60000, 'Iran': +100000,
  'DR Congo': +100000, 'Tunisia': +150000, 'Saudi Arabia': +150000,
  'Australia': +250000, 'New Zealand': +250000, 'Qatar': +250000,
  'Cabo Verde': +250000, 'Uzbekistan': +250000, 'South Africa': +250000,
  'Iraq': +250000, 'Jordan': +250000, 'Panama': +250000,
  'Curaçao': +250000, 'Haiti': +250000,
};

const formatOdds = (odds) => {
  if (!odds) return null;
  return odds >= 0 ? `+${odds}` : `${odds}`;
};

export default function App() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState({});
  const [meta, setMeta] = useState({}); // match_id -> { home, away, status }

  const [view, setView] = useState('matches');

  // Admin (manual override) state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [busyMatch, setBusyMatch] = useState(null);
  const [jumpOpen, setJumpOpen] = useState(false);

  // Load results from Supabase and subscribe to live changes
  useEffect(() => {
    let mounted = true;

    const loadResults = async () => {
      const { data, error } = await supabase
        .from('results')
        .select('match_id, winner, locked, home_score, away_score, status');
      if (!error && data && mounted) {
        const map = {};
        const lockMap = {};
        const metaMap = {};
        data.forEach(row => {
          map[row.match_id] = row.winner;
          lockMap[row.match_id] = row.locked;
          metaMap[row.match_id] = { home: row.home_score, away: row.away_score, status: row.status };
        });
        setResults(map);
        setLocked(lockMap);
        setMeta(metaMap);
      }
      if (mounted) setLoading(false);
    };

    loadResults();

    const channel = supabase
      .channel('results-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'results' }, payload => {
        setResults(prev => {
          const next = { ...prev };
          if (payload.eventType === 'DELETE') {
            delete next[payload.old.match_id];
          } else {
            next[payload.new.match_id] = payload.new.winner;
          }
          return next;
        });
        setLocked(prev => {
          const next = { ...prev };
          if (payload.eventType === 'DELETE') {
            delete next[payload.old.match_id];
          } else {
            next[payload.new.match_id] = payload.new.locked;
          }
          return next;
        });
        setMeta(prev => {
          const next = { ...prev };
          if (payload.eventType === 'DELETE') {
            delete next[payload.old.match_id];
          } else {
            next[payload.new.match_id] = {
              home: payload.new.home_score,
              away: payload.new.away_score,
              status: payload.new.status,
            };
          }
          return next;
        });
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Call the password-protected Edge Function to set or reset a result.
  const callManual = async (body) => {
    const res = await fetch(`${functionsUrl}/manual-result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify(body),
    });
    return res;
  };

  const handleLogin = async () => {
    // Verify the password by attempting a harmless authenticated check:
    // we send a "set" for a non-existent match id and read the response.
    // Simpler: just store it and let the first real action validate.
    // To give immediate feedback, do a lightweight verification call.
    const res = await callManual({ password: passwordInput, action: 'verify' });
    if (res.status === 401) {
      setLoginError('Incorrect password');
      setPasswordInput('');
      return;
    }
    // Any non-401 (including 400 "Unknown action") means the password was accepted.
    setAdminPassword(passwordInput);
    setIsAdmin(true);
    setShowLogin(false);
    setPasswordInput('');
    setLoginError('');
  };

  const setResult = async (matchId, winner) => {
    setBusyMatch(matchId);
    // optimistic
    setResults(prev => ({ ...prev, [matchId]: winner }));
    setLocked(prev => ({ ...prev, [matchId]: true }));
    const res = await callManual({ password: adminPassword, action: 'set', matchId, winner });
    if (!res.ok) {
      // revert by reloading from db
      const { data } = await supabase.from('results').select('match_id, winner, locked');
      const map = {}, lockMap = {};
      (data || []).forEach(r => { map[r.match_id] = r.winner; lockMap[r.match_id] = r.locked; });
      setResults(map); setLocked(lockMap);
    }
    setBusyMatch(null);
  };

  const resetResult = async (matchId) => {
    setBusyMatch(matchId);
    setResults(prev => { const n = { ...prev }; delete n[matchId]; return n; });
    setLocked(prev => { const n = { ...prev }; delete n[matchId]; return n; });
    await callManual({ password: adminPassword, action: 'reset', matchId });
    setBusyMatch(null);
  };

  const getPlayersForTeam = (team) => {
    return PLAYERS.filter(player => player.teams.includes(team));
  };

  const isLiveStatus = (s) => s === 'IN_PLAY' || s === 'PAUSED';
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD local

  // Podium colors for the top three (gold / silver / bronze), null otherwise.
  const medal = (index) => {
    if (index === 0) return { solid: '#fbbf24', tint: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.4)', glow: 'rgba(251,191,36,0.08)', text: '#040d18', emoji: '🥇' };
    if (index === 1) return { solid: '#cbd5e1', tint: 'rgba(203,213,225,0.12)', border: 'rgba(203,213,225,0.4)', glow: 'rgba(203,213,225,0.06)', text: '#040d18', emoji: '🥈' };
    if (index === 2) return { solid: '#d8924a', tint: 'rgba(216,146,74,0.14)', border: 'rgba(216,146,74,0.4)', glow: 'rgba(216,146,74,0.06)', text: '#040d18', emoji: '🥉' };
    return null;
  };

  const scrollToId = (id) => {
    setJumpOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Parse a match's date + "3:00 PM ET" time into a sortable Date.
  const matchKickoff = (m) => {
    const t = m.time.replace(' ET', '').trim();
    const mt = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let h = 0, min = 0;
    if (mt) {
      h = parseInt(mt[1], 10) % 12;
      if (/PM/i.test(mt[3])) h += 12;
      min = parseInt(mt[2], 10);
    }
    return new Date(`${m.date}T${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:00`);
  };

  // For a team: the match that's live now, else the soonest match without a
  // recorded result, else null (all done). Returns { match, live }.
  const nextMatchForTeam = (team) => {
    const teamMatches = MATCHES
      .filter(m => m.team1 === team || m.team2 === team)
      .sort((a, b) => matchKickoff(a) - matchKickoff(b));
    const liveOne = teamMatches.find(m => isLiveStatus(meta[m.id]?.status));
    if (liveOne) return { match: liveOne, live: true };
    const upcoming = teamMatches.find(m => !results[m.id] && meta[m.id]?.status !== 'FINISHED');
    return upcoming ? { match: upcoming, live: false } : null;
  };

  // Short opponent label for a team's next match, e.g. "vs Brazil · Jun 17 3:00".
  const shortDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const nextMatchLabel = (team) => {
    const nm = nextMatchForTeam(team);
    if (!nm) return null;
    const opp = nm.match.team1 === team ? nm.match.team2 : nm.match.team1;
    if (nm.live) return { live: true, opp };
    const time = nm.match.time.replace(' ET', '').replace(/:00/, '').replace(/\s/, '');
    const isToday = nm.match.date === todayStr;
    return { live: false, opp, time, date: shortDate(nm.match.date), isToday };
  };

  const getPlayerStats = () => {
    return PLAYERS.map(player => {
      const stats = {
        player: player.name,
        teams: player.teams,
        matches: []
      };

      player.teams.forEach(team => {
        MATCHES.forEach(match => {
          if (match.team1 === team || match.team2 === team) {
            const result = results[match.id];
            let outcome = 'pending';
            
            if (result === 'draw') {
              outcome = 'draw';
            } else if (result === team) {
              outcome = 'win';
            } else if (result && result !== team) {
              outcome = 'loss';
            }

            stats.matches.push({
              id: match.id,
              team,
              opponent: match.team1 === team ? match.team2 : match.team1,
              outcome,
              date: match.date,
              time: match.time
            });
          }
        });
      });

      return stats;
    });
  };

  const calculatePoints = () => {
    return PLAYERS.map(player => {
      let points = 0;
      let remaining = 0;     // matches still to be played that involve their teams
      MATCHES.forEach(match => {
        const ownsTeam1 = player.teams.includes(match.team1);
        const ownsTeam2 = player.teams.includes(match.team2);
        if (!ownsTeam1 && !ownsTeam2) return;

        const result = results[match.id];
        const done = !!result || meta[match.id]?.status === 'FINISHED';

        if (done && result) {
          // Award actual points: 1 if their team won; 0.5 per owned team in a draw.
          if (result === 'draw') {
            points += (ownsTeam1 ? 0.5 : 0) + (ownsTeam2 ? 0.5 : 0);
          } else if (player.teams.includes(result)) {
            points += 1;
          }
        } else {
          // Not finished — still winnable. Even when a player owns BOTH teams in
          // a match, only 1 point is possible from it (a win = 1; a draw =
          // 0.5 + 0.5 = 1), so each remaining match adds exactly 1 to the ceiling.
          remaining += 1;
        }
      });
      // Maximum they could still finish on: current points + 1 per game left.
      const maxPoints = points + remaining;
      const oddsSum = player.teams.reduce((sum, team) => sum + (ODDS[team] ?? 999999), 0);
      return { ...player, points, oddsSum, remaining, maxPoints };
    }).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;       // most points
      if (b.remaining !== a.remaining) return b.remaining - a.remaining; // more games left
      return a.oddsSum - b.oddsSum;                                 // lowest odds sum
    });
  };

  const leaderboard = calculatePoints();
  const groupedMatches = {};
  
  MATCHES.forEach(match => {
    if (!groupedMatches[match.date]) {
      groupedMatches[match.date] = [];
    }
    groupedMatches[match.date].push(match);
  });

  const sortedDates = Object.keys(groupedMatches).sort();

  // A match belongs in "Completed" only the day AFTER it finished: it must be
  // finished/have a result AND its date must be before today. Finished games
  // from today stay in Upcoming for the rest of the day.
  const isCompletedMatch = (m) => {
    const done = !!results[m.id] || meta[m.id]?.status === 'FINISHED';
    return done && m.date < todayStr;
  };

  const upcomingDates = sortedDates.filter(d => groupedMatches[d].some(m => !isCompletedMatch(m)));
  const completedDates = sortedDates.filter(d => groupedMatches[d].some(m => isCompletedMatch(m)));

  // Is there at least one match scheduled for today?
  const matchesToday = (groupedMatches[todayStr] || []).length > 0;
  const todayCount = (groupedMatches[todayStr] || []).length;

  // ----- Ticker: matches for "today" (or the next upcoming match day) -----
  const anyLiveNow = MATCHES.some(m => isLiveStatus(meta[m.id]?.status));

  let tickerDate = todayStr;
  let tickerMatches = groupedMatches[todayStr] || [];
  if (tickerMatches.length === 0) {
    // No matches today — show the next upcoming match day instead.
    const futureDate = sortedDates.find(d => d >= todayStr);
    if (futureDate) {
      tickerDate = futureDate;
      tickerMatches = groupedMatches[futureDate];
    }
  }
  const tickerIsToday = tickerDate === todayStr;

  // Make sure any live match appears in the ticker even if its calendar date
  // differs (e.g. a midnight kickoff), then sort so LIVE matches come first.
  const liveMatches = MATCHES.filter(m => isLiveStatus(meta[m.id]?.status));
  const tickerIds = new Set(tickerMatches.map(m => m.id));
  const extraLive = liveMatches.filter(m => !tickerIds.has(m.id));
  tickerMatches = [...extraLive, ...tickerMatches].sort((a, b) => {
    const aLive = isLiveStatus(meta[a.id]?.status) ? 0 : 1;
    const bLive = isLiveStatus(meta[b.id]?.status) ? 0 : 1;
    if (aLive !== bLive) return aLive - bLive;   // live first
    return a.id - b.id;                          // then chronological
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #040d18 0%, #081a32 50%, #0a0d18 100%)' }}>
        <div className="text-white text-lg">Loading results…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #040d18 0%, #081a32 50%, #0a0d18 100%)', backgroundAttachment: 'fixed' }}>

      {/* ===== Floating "Jump to" menu (always available) ===== */}
      <div className="fixed z-50" style={{ right: '20px', bottom: '20px' }}>
        {jumpOpen && (
          <>
            <div className="fixed inset-0" style={{ zIndex: -1 }} onClick={() => setJumpOpen(false)}></div>
            <div className="absolute right-0 bottom-16 w-60 rounded-xl overflow-hidden shadow-2xl" style={{ background: '#071e38', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="px-3 py-2 text-[10px] uppercase tracking-wide font-black text-gray-500" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Sections</div>
              <button onClick={() => scrollToId('standings')} className="w-full text-left px-3 py-2.5 text-sm text-gray-200 hover:bg-white/5">🏆 Standings</button>
              <button onClick={() => { setView('matches'); setTimeout(() => scrollToId('matches'), 0); }} className="w-full text-left px-3 py-2.5 text-sm text-gray-200 hover:bg-white/5">⚽ Matches</button>
              <div className="px-3 py-2 text-[10px] uppercase tracking-wide font-black text-gray-500" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Jump to owner</div>
              <div className="max-h-56 overflow-y-auto">
                {leaderboard.map((p, i) => (
                  <button key={p.id} onClick={() => scrollToId(`player-${p.id}`)} className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-white/5 flex items-center justify-between">
                    <span>{medal(i) ? `${medal(i).emoji} ` : `${i + 1}. `}{p.name}</span>
                    <span className="text-xs font-bold" style={{ color: '#C8102E' }}>{Number.isInteger(p.points) ? p.points : p.points.toFixed(1)}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <button
          onClick={() => setJumpOpen(o => !o)}
          className="flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm shadow-2xl transition-all"
          style={{ background: '#C8102E', color: '#ffffff', boxShadow: '0 4px 20px rgba(200,16,46,0.4)' }}
        >
          {matchesToday && !jumpOpen && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#4ade80' }}></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#4ade80' }}></span>
            </span>
          )}
          {jumpOpen ? '✕ Close' : '☰ Jump to'}
        </button>
      </div>

      {/* Password Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="rounded-xl p-8 w-full max-w-sm" style={{ background: '#071e38', border: '1px solid rgba(200,16,46,0.4)' }}>
            <h3 className="text-white font-bold text-xl mb-2">Admin Override</h3>
            <p className="text-gray-400 text-sm mb-6">Enter the password to set or correct results manually.</p>
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setLoginError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white mb-2 placeholder-gray-500"
              autoFocus
            />
            {loginError && <p className="text-red-400 text-xs mb-3">{loginError}</p>}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowLogin(false); setPasswordInput(''); setLoginError(''); }}
                className="flex-1 py-2 rounded-lg text-gray-400 font-bold"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="flex-1 py-2 rounded-lg font-bold"
                style={{ background: '#C8102E', color: '#ffffff' }}
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b" style={{ borderColor: 'rgba(200, 16, 46, 0.35)', background: 'linear-gradient(180deg, rgba(200,16,46,0.08) 0%, rgba(4,13,24,0) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-8">
          {/* Top row: status + admin, kept out of the way so the title can center */}
          <div className="flex items-center justify-end gap-3 mb-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#4ade80' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#4ade80' }}></span>
              </span>
              Live · Auto-updating
            </div>
            {isAdmin ? (
              <button
                onClick={() => { setIsAdmin(false); setAdminPassword(''); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs transition"
                style={{ background: 'rgba(200,16,46,0.25)', color: '#ff6b81', border: '1px solid rgba(200,16,46,0.5)' }}
              >
                🔓 Admin on
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs transition"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                🔒 Admin
              </button>
            )}
          </div>

          {/* Centered title block — trophy is absolutely placed so the
              text + subtitle center together as one column */}
          <div className="flex flex-col items-center text-center">
            <div className="relative inline-flex flex-col items-center">
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="World Cup trophy" className="hidden sm:block absolute drop-shadow" style={{ right: 'calc(100% + 12px)', top: '4px' }}>
                <defs>
                  <linearGradient id="wcGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FCE38A" />
                    <stop offset="45%" stopColor="#E6B53C" />
                    <stop offset="100%" stopColor="#B8860B" />
                  </linearGradient>
                </defs>
                <ellipse cx="32" cy="13" rx="10" ry="9" fill="url(#wcGold)" stroke="#8a6508" strokeWidth="0.8" />
                <path d="M22.5 11 H41.5 M24 16 H40 M32 4.5 V21.5" stroke="#8a6508" strokeWidth="0.7" opacity="0.6" fill="none" />
                <path d="M26 21 C20 28, 22 40, 28 47 L30 47 C25 40, 24 30, 30 22 Z" fill="url(#wcGold)" stroke="#8a6508" strokeWidth="0.7" />
                <path d="M38 21 C44 28, 42 40, 36 47 L34 47 C39 40, 40 30, 34 22 Z" fill="url(#wcGold)" stroke="#8a6508" strokeWidth="0.7" />
                <path d="M25 47 H39 L41 53 H23 Z" fill="url(#wcGold)" stroke="#8a6508" strokeWidth="0.7" />
                <rect x="21" y="53" width="22" height="5" rx="1.5" fill="#1a1206" stroke="#8a6508" strokeWidth="0.7" />
                <rect x="23" y="54.5" width="18" height="2" rx="1" fill="url(#wcGold)" opacity="0.85" />
              </svg>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight" style={{ color: '#C8102E', textShadow: '0 2px 20px rgba(200,16,46,0.3)' }}>HOOD RATS</h1>
              <p className="text-gray-400 text-sm sm:text-base mt-2 tracking-[0.3em] uppercase font-semibold">2026 World Cup Pool</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Match Ticker (solid wrapping field, no scroll) ===== */}
      {tickerMatches.length > 0 && (
        <div id="ticker" style={{ background: 'rgba(4, 13, 24, 0.95)', borderBottom: '1px solid rgba(200,16,46,0.3)' }}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              {anyLiveNow ? (
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide" style={{ color: '#4ade80' }}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#4ade80' }}></span>
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#4ade80' }}></span>
                  </span>
                  Live Now
                </span>
              ) : (
                <span className="text-xs font-black uppercase tracking-wide" style={{ color: '#C8102E' }}>
                  {tickerIsToday ? "Today's Matches" : new Date(tickerDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tickerMatches.map(m => {
                const r = results[m.id];
                const md = meta[m.id] || {};
                const live = isLiveStatus(md.status);
                const finished = md.status === 'FINISHED' || !!r;
                const hasScore = md.home != null && md.away != null;
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{
                      background: live ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
                      border: live ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="flex flex-col items-center min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-base leading-none">{COUNTRY_FLAGS[m.team1] || '🏳️'}</span>
                        <span className="text-xs font-bold text-white whitespace-nowrap">{m.team1}</span>
                      </div>
                      {getPlayersForTeam(m.team1).length > 0 && (
                        <span className="text-[9px] whitespace-nowrap" style={{ color: '#C8102E' }}>{getPlayersForTeam(m.team1).map(p => p.name).join(', ')}</span>
                      )}
                    </div>
                    {hasScore ? (
                      <span className="text-sm font-black px-1.5 shrink-0" style={{ color: live ? '#4ade80' : '#ffffff' }}>
                        {md.home}–{md.away}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 px-1 shrink-0">vs</span>
                    )}
                    <div className="flex flex-col items-center min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-base leading-none">{COUNTRY_FLAGS[m.team2] || '🏳️'}</span>
                        <span className="text-xs font-bold text-white whitespace-nowrap">{m.team2}</span>
                      </div>
                      {getPlayersForTeam(m.team2).length > 0 && (
                        <span className="text-[9px] whitespace-nowrap" style={{ color: '#C8102E' }}>{getPlayersForTeam(m.team2).map(p => p.name).join(', ')}</span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase ml-1 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0" style={{
                      background: live ? '#4ade80' : finished ? 'rgba(200,16,46,0.8)' : 'rgba(255,255,255,0.1)',
                      color: live ? '#040d18' : finished ? '#ffffff' : '#9ca3af'
                    }}>
                      {live ? (md.status === 'PAUSED' ? 'HT' : 'Live') : finished ? 'FT' : m.time.replace(' ET', '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== Quick-look leaderboard (1–10, name + points) ===== */}
      <div style={{ background: 'rgba(4, 13, 24, 0.6)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="text-[10px] uppercase tracking-wide font-black text-gray-500 mb-2">Standings</div>
          <div className="flex flex-wrap gap-2">
            {leaderboard.map((p, i) => {
              const m = medal(i);
              return (
              <button
                key={p.id}
                onClick={() => scrollToId(`player-${p.id}`)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full transition-all hover:brightness-125"
                style={{
                  background: m ? m.tint : 'rgba(255,255,255,0.05)',
                  border: m ? `1px solid ${m.border}` : '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <span className="flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-black shrink-0" style={{
                  background: m ? m.solid : 'rgba(255,255,255,0.1)',
                  color: m ? m.text : '#9ca3af'
                }}>
                  {i + 1}
                </span>
                <span className="text-xs font-bold text-white whitespace-nowrap">{p.name}</span>
                <span className="text-xs font-black whitespace-nowrap" style={{ color: '#C8102E' }}>
                  {Number.isInteger(p.points) ? p.points : p.points.toFixed(1)}
                </span>
              </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1" id="standings" style={{ scrollMarginTop: '90px' }}>
            <h2 className="text-xl font-black text-white mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="h-5 w-1 rounded-full" style={{ background: '#C8102E' }}></span>
              Standings
            </h2>
            <div className="space-y-2.5">
              {leaderboard.map((player, index) => {
                const teamRecords = player.teams.map(team => {
                  const teamMatches = MATCHES.filter(m => m.team1 === team || m.team2 === team);
                  const wins = teamMatches.filter(m => results[m.id] === team).length;
                  const draws = teamMatches.filter(m => results[m.id] === 'draw').length;
                  const losses = teamMatches.filter(m => results[m.id] && results[m.id] !== team && results[m.id] !== 'draw').length;
                  const played = wins + draws + losses;
                  return { team, wins, draws, losses, played, total: teamMatches.length };
                }).sort((a, b) => (ODDS[a.team] ?? Infinity) - (ODDS[b.team] ?? Infinity));

                return (
                  <div
                    key={player.id}
                    id={`player-${player.id}`}
                    className="rounded-xl p-4 transition-all"
                    style={{
                      scrollMarginTop: '90px',
                      background: index === 0
                        ? 'linear-gradient(135deg, rgba(200,16,46,0.2) 0%, rgba(4,13,24,0.85) 100%)'
                        : medal(index)
                          ? `linear-gradient(135deg, ${medal(index).tint} 0%, rgba(4,13,24,0.8) 100%)`
                          : 'rgba(4, 13, 24, 0.7)',
                      border: medal(index) ? `1px solid ${medal(index).border}` : '1px solid rgba(255,255,255,0.05)',
                      boxShadow: medal(index) ? `0 0 24px ${medal(index).glow}` : 'none'
                    }}
                  >
                    {/* Player Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="min-w-0">
                        <div className="text-white font-bold text-sm truncate">
                          {medal(index) ? `${medal(index).emoji} ` : `${index + 1}. `}{player.name}
                        </div>
                        {(() => {
                          // Owner's soonest upcoming match across all their teams.
                          const upcoming = player.teams
                            .map(t => nextMatchForTeam(t))
                            .filter(Boolean)
                            .sort((a, b) => {
                              if (a.live !== b.live) return a.live ? -1 : 1;
                              return matchKickoff(a.match) - matchKickoff(b.match);
                            })[0];
                          if (!upcoming) return null;
                          const ownTeam = player.teams.find(t => upcoming.match.team1 === t || upcoming.match.team2 === t);
                          const opp = upcoming.match.team1 === ownTeam ? upcoming.match.team2 : upcoming.match.team1;
                          const oToday = upcoming.match.date === todayStr;
                          return (
                            <div className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: upcoming.live ? '#4ade80' : '#6b7280' }}>
                              <span>{COUNTRY_FLAGS[ownTeam]}</span>
                              {upcoming.live ? (
                                <span className="font-bold">LIVE vs {opp}</span>
                              ) : (
                                <span>next: vs {opp} · {oToday ? <span className="font-bold" style={{ color: '#4ade80' }}>Today</span> : shortDate(upcoming.match.date)} {upcoming.match.time.replace(' ET', '').replace(':00', '')}</span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                      <div className="font-bold text-lg shrink-0 ml-2" style={{ color: '#C8102E' }}>
                        {Number.isInteger(player.points) ? player.points : player.points.toFixed(1)} <span className="text-xs text-gray-500 font-normal">pts</span>
                      </div>
                    </div>

                    {/* Remaining + max-possible stats */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 text-center rounded-md py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <div className="text-sm font-black text-white">{player.remaining}</div>
                        <div className="text-[9px] uppercase tracking-wide text-gray-500 font-bold">Games left</div>
                      </div>
                      <div className="flex-1 text-center rounded-md py-1.5" style={{ background: 'rgba(74,222,128,0.08)' }}>
                        <div className="text-sm font-black" style={{ color: '#4ade80' }}>
                          {Number.isInteger(player.maxPoints) ? player.maxPoints : player.maxPoints.toFixed(1)}
                        </div>
                        <div className="text-[9px] uppercase tracking-wide text-gray-500 font-bold">Max possible</div>
                      </div>
                    </div>

                    {/* Team breakdown */}
                    <div className="space-y-1">
                      {teamRecords.map(({ team, wins, draws, losses, played, total }) => {
                        const nm = nextMatchLabel(team);
                        return (
                        <div key={team} className="py-1.5 px-2 rounded-md" style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-base leading-none">{COUNTRY_FLAGS[team] || '🏳️'}</span>
                              <span className="text-gray-200 text-xs truncate">{team}</span>
                            </div>
                            <div className="flex items-center gap-1 ml-2 shrink-0">
                              {ODDS[team] && (
                                <span className="text-[10px] font-bold px-1 rounded" style={{ background: 'rgba(250, 204, 21, 0.12)', color: '#fde047' }}>
                                  {formatOdds(ODDS[team])}
                                </span>
                              )}
                              {played === 0 ? (
                                <span className="text-gray-600 text-xs">–</span>
                              ) : (
                                <>
                                  {wins > 0 && <span className="text-[10px] font-bold px-1 rounded" style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>{wins}W</span>}
                                  {draws > 0 && <span className="text-[10px] font-bold px-1 rounded" style={{ background: 'rgba(250,204,21,0.2)', color: '#fde047' }}>{draws}D</span>}
                                  {losses > 0 && <span className="text-[10px] font-bold px-1 rounded" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>{losses}L</span>}
                                </>
                              )}
                            </div>
                          </div>
                          {nm && (
                            <div className="mt-0.5 pl-6 text-[10px]" style={{ color: nm.live ? '#4ade80' : '#6b7280' }}>
                              {nm.live ? (
                                <span className="inline-flex items-center gap-1 font-bold">
                                  <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#4ade80' }}></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#4ade80' }}></span>
                                  </span>
                                  Live · vs {nm.opp}
                                </span>
                              ) : (
                                <span>vs {nm.opp} · {nm.isToday ? <span className="font-bold" style={{ color: '#4ade80' }}>Today</span> : nm.date} {nm.time}</span>
                              )}
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matches Section */}
          <div className="lg:col-span-3" id="matches" style={{ scrollMarginTop: '90px' }}>
            <div className="inline-flex gap-1 mb-6 p-1 rounded-full" style={{ background: 'rgba(4, 13, 24, 0.85)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => setView('matches')}
                className="px-5 py-2 rounded-full font-bold text-sm transition-all"
                style={{
                  background: view === 'matches' ? '#C8102E' : 'transparent',
                  color: view === 'matches' ? '#ffffff' : '#9ca3af'
                }}
              >
                Upcoming
              </button>
              <button
                onClick={() => setView('completed')}
                className="px-5 py-2 rounded-full font-bold text-sm transition-all"
                style={{
                  background: view === 'completed' ? '#C8102E' : 'transparent',
                  color: view === 'completed' ? '#ffffff' : '#9ca3af'
                }}
              >
                Completed
              </button>
              <button
                onClick={() => setView('stats')}
                className="px-5 py-2 rounded-full font-bold text-sm transition-all"
                style={{
                  background: view === 'stats' ? '#C8102E' : 'transparent',
                  color: view === 'stats' ? '#ffffff' : '#9ca3af'
                }}
              >
                Player Stats
              </button>
            </div>

            {(view === 'matches' || view === 'completed') ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">{view === 'completed' ? 'Completed Matches' : 'Upcoming Matches'}</h2>
            {(() => {
              const showDates = view === 'completed' ? completedDates : upcomingDates;
              const matchFilter = (m) => view === 'completed' ? isCompletedMatch(m) : !isCompletedMatch(m);
              if (showDates.length === 0) {
                return <div className="text-gray-500 text-sm py-8 text-center rounded-xl" style={{ background: 'rgba(4,13,24,0.5)' }}>{view === 'completed' ? 'No completed matches yet. Games move here the day after they finish.' : 'No upcoming matches.'}</div>;
              }
              return (
            <div className="space-y-8">
              {(view === 'completed' ? [...showDates].reverse() : showDates).map(date => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-1 rounded-full" style={{ background: date === todayStr ? '#4ade80' : '#C8102E' }}></div>
                    <div className="text-base font-bold text-white uppercase tracking-wide">
                      {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    {date === todayStr && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>Today</span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {groupedMatches[date].filter(matchFilter).map(match => {
                      const result = results[match.id];
                      const md = meta[match.id] || {};
                      const live = md.status === 'IN_PLAY' || md.status === 'PAUSED';
                      const hasScore = md.home != null && md.away != null;
                      return (
                        <div key={match.id} className="rounded-xl p-4 transition-all" style={{
                          background: live ? 'rgba(74,222,128,0.06)' : 'rgba(4, 13, 24, 0.7)',
                          border: live ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(255,255,255,0.05)',
                          boxShadow: live ? '0 0 20px rgba(74,222,128,0.1)' : 'none'
                        }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm text-gray-400">{match.time}</div>
                            <div className="flex items-center gap-2">
                              {result && locked[match.id] && (
                                <div className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(250,204,21,0.2)', color: '#fde047' }}>
                                  ✎ Manual
                                </div>
                              )}
                              {live ? (
                                <div className="flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded" style={{ background: '#4ade80', color: '#040d18' }}>
                                  <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#040d18' }}></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#040d18' }}></span>
                                  </span>
                                  {md.status === 'PAUSED' ? 'Half-time' : 'Live'}
                                </div>
                              ) : result ? (
                                <div className="text-xs font-bold px-2 py-1 rounded" style={{ background: '#C8102E', color: '#ffffff' }}>
                                  Final
                                </div>
                              ) : (
                                <div className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                                  Scheduled
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            {/* Team 1 */}
                            <div className="flex-1 text-center">
                              <div className="text-3xl mb-2">{COUNTRY_FLAGS[match.team1] || '🏳️'}</div>
                              <div className="font-bold text-sm" style={{ color: result === match.team1 ? '#4ade80' : '#ffffff' }}>
                                {match.team1}
                              </div>
                              <div className="text-xs mb-2" style={{ color: '#C8102E' }}>
                                {getPlayersForTeam(match.team1).map(p => p.name).join(', ') || ''}
                              </div>
                              {result === match.team1 && (
                                <div className="inline-block px-2 py-1 rounded font-bold text-xs" style={{ background: '#4ade80', color: '#040d18' }}>
                                  ✓ Won
                                </div>
                              )}
                            </div>

                            {/* Center column: score / vs / Draw */}
                            <div className="flex flex-col items-center gap-2 px-3">
                              {hasScore ? (
                                <div className="text-2xl font-black" style={{ color: live ? '#4ade80' : '#ffffff' }}>
                                  {md.home}<span className="text-gray-500 mx-1">–</span>{md.away}
                                </div>
                              ) : (
                                <div className="text-gray-500 font-bold text-sm">vs</div>
                              )}
                              {result === 'draw' && (
                                <div className="px-2 py-1 rounded font-bold text-xs" style={{ background: '#fde047', color: '#040d18' }}>
                                  Draw
                                </div>
                              )}
                            </div>

                            {/* Team 2 */}
                            <div className="flex-1 text-center">
                              <div className="text-3xl mb-2">{COUNTRY_FLAGS[match.team2] || '🏳️'}</div>
                              <div className="font-bold text-sm" style={{ color: result === match.team2 ? '#4ade80' : '#ffffff' }}>
                                {match.team2}
                              </div>
                              <div className="text-xs mb-2" style={{ color: '#C8102E' }}>
                                {getPlayersForTeam(match.team2).map(p => p.name).join(', ') || ''}
                              </div>
                              {result === match.team2 && (
                                <div className="inline-block px-2 py-1 rounded font-bold text-xs" style={{ background: '#4ade80', color: '#040d18' }}>
                                  ✓ Won
                                </div>
                              )}
                            </div>
                          </div>

                          {result && (
                            <div className="text-center text-sm text-gray-400">
                              {result === 'draw'
                                ? `Draw · +0.5 each`
                                : `${COUNTRY_FLAGS[result]} ${result} wins · +1 pt`
                              }
                            </div>
                          )}

                          {/* Match odds (3-way moneyline) */}
                          {MATCH_ODDS[match.id] && (
                            <div className="mt-3 pt-3 grid grid-cols-3 gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                              {[
                                { label: match.team1, val: MATCH_ODDS[match.id].h },
                                { label: 'Draw', val: MATCH_ODDS[match.id].t },
                                { label: match.team2, val: MATCH_ODDS[match.id].a },
                              ].map((o, i) => (
                                <div key={i} className="text-center rounded py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                  <div className="text-[10px] text-gray-500 truncate px-1">{o.label}</div>
                                  <div className="text-xs font-bold" style={{ color: '#a5b4fc' }}>{formatOdds(o.val)}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Admin manual controls */}
                          {isAdmin && (
                            <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                              <div className="text-xs text-gray-500 mb-2 text-center">Manual override</div>
                              <div className="flex items-center gap-2">
                                <button
                                  disabled={busyMatch === match.id}
                                  onClick={() => setResult(match.id, match.team1)}
                                  className="flex-1 px-2 py-2 rounded font-bold text-xs transition"
                                  style={{
                                    background: result === match.team1 ? '#C8102E' : 'rgba(200,16,46,0.2)',
                                    color: result === match.team1 ? '#ffffff' : '#d1d5db',
                                    opacity: busyMatch === match.id ? 0.5 : 1
                                  }}
                                >
                                  {match.team1}
                                </button>
                                <button
                                  disabled={busyMatch === match.id}
                                  onClick={() => setResult(match.id, 'draw')}
                                  className="px-3 py-2 rounded font-bold text-xs transition"
                                  style={{
                                    background: result === 'draw' ? '#fde047' : 'rgba(250,204,21,0.15)',
                                    color: result === 'draw' ? '#040d18' : '#fde047',
                                    opacity: busyMatch === match.id ? 0.5 : 1
                                  }}
                                >
                                  Draw
                                </button>
                                <button
                                  disabled={busyMatch === match.id}
                                  onClick={() => setResult(match.id, match.team2)}
                                  className="flex-1 px-2 py-2 rounded font-bold text-xs transition"
                                  style={{
                                    background: result === match.team2 ? '#C8102E' : 'rgba(200,16,46,0.2)',
                                    color: result === match.team2 ? '#ffffff' : '#d1d5db',
                                    opacity: busyMatch === match.id ? 0.5 : 1
                                  }}
                                >
                                  {match.team2}
                                </button>
                              </div>
                              {result && (
                                <button
                                  disabled={busyMatch === match.id}
                                  onClick={() => resetResult(match.id)}
                                  className="w-full mt-2 px-2 py-1 rounded font-bold text-xs"
                                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', opacity: busyMatch === match.id ? 0.5 : 1 }}
                                >
                                  Clear result (let auto-sync take over)
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
                </div>
              );
            })()}
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Player Statistics</h2>
                <div className="space-y-6">
                  {getPlayerStats().map((playerStats) => {
                    const wins = playerStats.matches.filter(m => m.outcome === 'win').length;
                    const draws = playerStats.matches.filter(m => m.outcome === 'draw').length;
                    const losses = playerStats.matches.filter(m => m.outcome === 'loss').length;
                    const pending = playerStats.matches.filter(m => m.outcome === 'pending').length;

                    return (
                      <div key={playerStats.player} className="rounded-lg p-6" style={{ background: 'rgba(4, 13, 24, 0.85)' }}>
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-white mb-2">{playerStats.player}</h3>
                          <div className="flex gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Wins: </span>
                              <span className="text-green-400 font-bold">{wins}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Draws: </span>
                              <span className="font-bold" style={{ color: '#fde047' }}>{draws}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Losses: </span>
                              <span className="text-red-400 font-bold">{losses}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Pending: </span>
                              <span className="text-gray-400 font-bold">{pending}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {playerStats.matches.map(match => (
                            <div
                              key={match.id}
                              className="flex items-center justify-between p-3 rounded"
                              style={{
                                background: match.outcome === 'win' ? 'rgba(34, 197, 94, 0.1)' : match.outcome === 'draw' ? 'rgba(250,204,21,0.08)' : match.outcome === 'loss' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 100, 100, 0.1)',
                                borderLeft: match.outcome === 'win' ? '3px solid #22c55e' : match.outcome === 'draw' ? '3px solid #fde047' : match.outcome === 'loss' ? '3px solid #ef4444' : '3px solid #444'
                              }}
                            >
                              <div className="flex-1">
                                <div className="text-white font-semibold text-sm">
                                  {COUNTRY_FLAGS[match.team]} {match.team} vs {COUNTRY_FLAGS[match.opponent]} {match.opponent}
                                </div>
                                <div className="text-gray-400 text-xs">{match.date} • {match.time}</div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-bold px-3 py-1 rounded" style={{
                                  background: match.outcome === 'win' ? '#22c55e' : match.outcome === 'draw' ? '#fde047' : match.outcome === 'loss' ? '#ef4444' : '#444',
                                  color: match.outcome === 'draw' ? '#040d18' : 'white'
                                }}>
                                  {match.outcome === 'win' ? '✓ W' : match.outcome === 'draw' ? '½ D' : match.outcome === 'loss' ? '✗ L' : '–'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
