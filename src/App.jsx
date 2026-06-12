import React, { useState, useEffect } from 'react';
import { supabase, functionsUrl, anonKey } from './supabaseClient';
import { Trophy } from 'lucide-react';

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
];

const MATCHES = [
  { id: 1, date: '2026-06-11', time: '3:00 PM ET', team1: 'Mexico', team2: 'South Africa' },
  { id: 2, date: '2026-06-11', time: '10:00 PM ET', team1: 'Korea Republic', team2: 'Czechia' },
  { id: 3, date: '2026-06-12', time: '3:00 PM ET', team1: 'Canada', team2: 'Bosnia and Herzegovina' },
  { id: 4, date: '2026-06-12', time: '9:00 PM ET', team1: 'USA', team2: 'Paraguay' },
  { id: 5, date: '2026-06-13', time: '3:00 PM ET', team1: 'Qatar', team2: 'Switzerland' },
  { id: 6, date: '2026-06-13', time: '6:00 PM ET', team1: 'Brazil', team2: 'Morocco' },
  { id: 7, date: '2026-06-13', time: '9:00 PM ET', team1: 'Haiti', team2: 'Scotland' },
  { id: 8, date: '2026-06-13', time: '12:00 AM ET', team1: 'Australia', team2: 'Türkiye' },
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
  { id: 20, date: '2026-06-16', time: '12:00 AM ET', team1: 'Austria', team2: 'Jordan' },
  { id: 21, date: '2026-06-17', time: '12:00 PM ET', team1: 'Portugal', team2: 'Uruguay' },
  { id: 22, date: '2026-06-17', time: '3:00 PM ET', team1: 'England', team2: 'Croatia' },
  { id: 23, date: '2026-06-17', time: '6:00 PM ET', team1: 'Panama', team2: 'Colombia' },
  { id: 24, date: '2026-06-17', time: '9:00 PM ET', team1: 'Uzbekistan', team2: 'Ghana' },
  { id: 25, date: '2026-06-18', time: '12:00 PM ET', team1: 'Czechia', team2: 'South Africa' },
  { id: 26, date: '2026-06-18', time: '3:00 PM ET', team1: 'Mexico', team2: 'Korea Republic' },
  { id: 27, date: '2026-06-18', time: '6:00 PM ET', team1: 'Switzerland', team2: 'Bosnia and Herzegovina' },
  { id: 28, date: '2026-06-18', time: '9:00 PM ET', team1: 'Canada', team2: 'Qatar' },
  { id: 29, date: '2026-06-19', time: '12:00 PM ET', team1: 'Morocco', team2: 'Paraguay' },
  { id: 30, date: '2026-06-19', time: '3:00 PM ET', team1: 'Türkiye', team2: 'USA' },
  { id: 31, date: '2026-06-19', time: '6:00 PM ET', team1: 'Curaçao', team2: 'Ecuador' },
  { id: 32, date: '2026-06-19', time: '9:00 PM ET', team1: 'Japan', team2: 'Tunisia' },
  { id: 33, date: '2026-06-20', time: '12:00 PM ET', team1: 'Scotland', team2: 'Haiti' },
  { id: 34, date: '2026-06-20', time: '3:00 PM ET', team1: 'Brazil', team2: 'Australia' },
  { id: 35, date: '2026-06-20', time: '6:00 PM ET', team1: 'Germany', team2: 'Denmark' },
  { id: 36, date: '2026-06-20', time: '9:00 PM ET', team1: 'Netherlands', team2: "Côte d'Ivoire" },
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
  { id: 49, date: '2026-06-24', time: '3:00 PM ET', team1: 'Switzerland', team2: 'Canada' },
  { id: 50, date: '2026-06-24', time: '3:00 PM ET', team1: 'Bosnia and Herzegovina', team2: 'Qatar' },
  { id: 51, date: '2026-06-24', time: '6:00 PM ET', team1: 'Scotland', team2: 'Brazil' },
  { id: 52, date: '2026-06-24', time: '6:00 PM ET', team1: 'Morocco', team2: 'Haiti' },
  { id: 53, date: '2026-06-24', time: '9:00 PM ET', team1: 'Czechia', team2: 'Mexico' },
  { id: 54, date: '2026-06-24', time: '9:00 PM ET', team1: 'South Africa', team2: 'Korea Republic' },
  { id: 55, date: '2026-06-25', time: '4:00 PM ET', team1: 'Ecuador', team2: 'Germany' },
  { id: 56, date: '2026-06-25', time: '4:00 PM ET', team1: 'Curaçao', team2: "Côte d'Ivoire" },
  { id: 57, date: '2026-06-25', time: '7:00 PM ET', team1: 'Japan', team2: 'Sweden' },
  { id: 58, date: '2026-06-25', time: '7:00 PM ET', team1: 'Tunisia', team2: 'Netherlands' },
  { id: 59, date: '2026-06-25', time: '10:00 PM ET', team1: 'Türkiye', team2: 'USA' },
  { id: 60, date: '2026-06-25', time: '10:00 PM ET', team1: 'Paraguay', team2: 'Australia' },
  { id: 61, date: '2026-06-26', time: '3:00 PM ET', team1: 'Norway', team2: 'France' },
  { id: 62, date: '2026-06-26', time: '3:00 PM ET', team1: 'Senegal', team2: 'Iraq' },
  { id: 63, date: '2026-06-26', time: '6:00 PM ET', team1: 'Cabo Verde', team2: 'Egypt' },
  { id: 64, date: '2026-06-26', time: '6:00 PM ET', team1: 'Saudi Arabia', team2: 'New Zealand' },
  { id: 65, date: '2026-06-26', time: '9:00 PM ET', team1: 'Algeria', team2: 'Austria' },
  { id: 66, date: '2026-06-26', time: '9:00 PM ET', team1: 'Jordan', team2: 'Argentina' },
  { id: 67, date: '2026-06-27', time: '12:00 PM ET', team1: 'Colombia', team2: 'Ghana' },
  { id: 68, date: '2026-06-27', time: '12:00 PM ET', team1: 'DR Congo', team2: 'Uzbekistan' },
  { id: 69, date: '2026-06-27', time: '3:00 PM ET', team1: 'England', team2: 'Panama' },
  { id: 70, date: '2026-06-27', time: '3:00 PM ET', team1: 'Croatia', team2: 'Montenegro' },
  { id: 71, date: '2026-06-27', time: '6:00 PM ET', team1: 'Portugal', team2: 'Denmark' },
  { id: 72, date: '2026-06-27', time: '6:00 PM ET', team1: 'Iceland', team2: 'Germany' },
];

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

  const [view, setView] = useState('matches');

  // Admin (manual override) state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [busyMatch, setBusyMatch] = useState(null);

  // Load results from Supabase and subscribe to live changes
  useEffect(() => {
    let mounted = true;

    const loadResults = async () => {
      const { data, error } = await supabase.from('results').select('match_id, winner, locked');
      if (!error && data && mounted) {
        const map = {};
        const lockMap = {};
        data.forEach(row => { map[row.match_id] = row.winner; lockMap[row.match_id] = row.locked; });
        setResults(map);
        setLocked(lockMap);
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
      MATCHES.forEach(match => {
        const result = results[match.id];
        if (result === 'draw' && (player.teams.includes(match.team1) || player.teams.includes(match.team2))) {
          points += 0.5;
        } else if (result && result !== 'draw' && player.teams.includes(result)) {
          points += 1;
        }
      });
      const oddsSum = player.teams.reduce((sum, team) => sum + (ODDS[team] ?? 999999), 0);
      return { ...player, points, oddsSum };
    }).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return a.oddsSum - b.oddsSum;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #040d18 0%, #081a32 50%, #0a0d18 100%)' }}>
        <div className="text-white text-lg">Loading results…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>

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
      <div className="border-b" style={{ borderColor: 'rgba(200, 16, 46, 0.5)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy style={{ color: '#C8102E' }} size={40} />
                <h1 className="text-5xl font-black" style={{ color: '#C8102E' }}>WORLD CUP 2026</h1>
              </div>
              <p className="text-gray-400 text-lg">Group Stage Pool Tracker</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#4ade80' }}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#4ade80' }}></span>
                </span>
                Live · Auto-updating
              </div>
              {isAdmin ? (
                <button
                  onClick={() => { setIsAdmin(false); setAdminPassword(''); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm"
                  style={{ background: 'rgba(200,16,46,0.25)', color: '#C8102E', border: '1px solid rgba(200,16,46,0.5)' }}
                >
                  🔓 Admin on
                </button>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  🔒 Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-6">Standings</h2>
            <div className="space-y-3">
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
                    className="rounded-lg p-4"
                    style={{
                      background: index === 0 ? 'rgba(200, 16, 46, 0.18)' : 'rgba(4, 13, 24, 0.85)',
                      borderLeft: index === 0 ? '4px solid #fbbf24' : '4px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    {/* Player Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white font-bold text-sm">
                        {index === 0 ? '🏆 ' : `${index + 1}. `}{player.name}
                      </div>
                      <div className="font-bold text-lg" style={{ color: '#C8102E' }}>
                        {Number.isInteger(player.points) ? player.points : player.points.toFixed(1)} <span className="text-xs text-gray-500 font-normal">pts</span>
                      </div>
                    </div>

                    {/* Team breakdown */}
                    <div className="space-y-1">
                      {teamRecords.map(({ team, wins, draws, losses, played, total }) => (
                        <div key={team} className="flex items-center justify-between py-1 px-2 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="text-base leading-none">{COUNTRY_FLAGS[team] || '🏳️'}</span>
                            <span className="text-gray-300 text-xs truncate">{team}</span>
                          </div>
                          <div className="flex items-center gap-1 ml-2 shrink-0">
                            {ODDS[team] && (
                              <span className="text-xs font-bold px-1 rounded" style={{ background: 'rgba(250, 204, 21, 0.15)', color: '#fde047' }}>
                                {formatOdds(ODDS[team])}
                              </span>
                            )}
                            {played === 0 ? (
                              <span className="text-gray-600 text-xs">–</span>
                            ) : (
                              <>
                                {wins > 0 && <span className="text-xs font-bold px-1 rounded" style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>{wins}W</span>}
                                {draws > 0 && <span className="text-xs font-bold px-1 rounded" style={{ background: 'rgba(250,204,21,0.2)', color: '#fde047' }}>{draws}D</span>}
                                {losses > 0 && <span className="text-xs font-bold px-1 rounded" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>{losses}L</span>}
                              </>
                            )}
                            <span className="text-gray-600 text-xs">{played}/{total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matches Section */}
          <div className="lg:col-span-3">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setView('matches')}
                className="px-6 py-2 rounded font-bold transition"
                style={{
                  background: view === 'matches' ? '#C8102E' : 'rgba(4, 13, 24, 0.85)',
                  color: view === 'matches' ? '#040d18' : 'white'
                }}
              >
                Matches
              </button>
              <button
                onClick={() => setView('stats')}
                className="px-6 py-2 rounded font-bold transition"
                style={{
                  background: view === 'stats' ? '#C8102E' : 'rgba(4, 13, 24, 0.85)',
                  color: view === 'stats' ? '#040d18' : 'white'
                }}
              >
                Player Stats
              </button>
            </div>

            {view === 'matches' ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Matches</h2>
            <div className="space-y-8">
              {sortedDates.map(date => (
                <div key={date}>
                  <div className="text-lg font-bold text-white mb-4 pb-2" style={{ borderBottom: '2px solid rgba(200, 16, 46, 0.35)' }}>
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric'
                    })}
                  </div>
                  <div className="space-y-3">
                    {groupedMatches[date].map(match => {
                      const result = results[match.id];
                      return (
                        <div key={match.id} className="rounded-lg p-4" style={{ background: 'rgba(4, 13, 24, 0.92)' }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm text-gray-400">{match.time}</div>
                            <div className="flex items-center gap-2">
                              {result && locked[match.id] && (
                                <div className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(250,204,21,0.2)', color: '#fde047' }}>
                                  ✎ Manual
                                </div>
                              )}
                              {result ? (
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

                            {/* Center column: vs / Draw */}
                            <div className="flex flex-col items-center gap-2 px-2">
                              <div className="text-gray-500 font-bold text-sm">vs</div>
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
