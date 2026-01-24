import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../SEO';
import { Trophy, Users, Undo2, Share2, RotateCcw, Eye, EyeOff, BarChart3, Clock, Play } from 'lucide-react';

const TennisScoring = () => {
  const { theme } = useTheme();
  const [matchId, setMatchId] = useState(null);
  const [isSpectator, setIsSpectator] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Match setup state
  const [matchStarted, setMatchStarted] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [matchType, setMatchType] = useState('mens-singles');
  const [bestOf, setBestOf] = useState(3);

  // Score state
  const [sets, setSets] = useState([0, 0]);
  const [games, setGames] = useState([[0, 0]]);
  const [points, setPoints] = useState([0, 0]);
  const [isTiebreak, setIsTiebreak] = useState(false);
  const [server, setServer] = useState(0); // 0 or 1
  const [matchWinner, setMatchWinner] = useState(null);

  // Statistics
  const [stats, setStats] = useState({
    player1: { aces: 0, doubleFaults: 0, winners: 0, unforcedErrors: 0, breakPointsWon: 0, breakPointsTotal: 0, firstServes: 0, firstServesIn: 0, totalPoints: 0 },
    player2: { aces: 0, doubleFaults: 0, winners: 0, unforcedErrors: 0, breakPointsWon: 0, breakPointsTotal: 0, firstServes: 0, firstServesIn: 0, totalPoints: 0 }
  });

  // History for undo
  const [history, setHistory] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [showStatInput, setShowStatInput] = useState(false);
  const [currentStatPlayer, setCurrentStatPlayer] = useState(null);

  // Load match from URL or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('match');
    const spectator = urlParams.get('spectator') === 'true';

    if (id) {
      setMatchId(id);
      setIsSpectator(spectator);
      loadMatch(id);
    } else {
      // Generate new match ID
      const newId = generateMatchId();
      setMatchId(newId);
    }
  }, []);

  // Auto-refresh for spectators
  useEffect(() => {
    if (isSpectator && autoRefresh && matchId) {
      const interval = setInterval(() => {
        loadMatch(matchId);
      }, 2000); // Refresh every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isSpectator, autoRefresh, matchId]);

  // Save match state
  useEffect(() => {
    if (matchStarted && matchId && !isSpectator) {
      const matchData = {
        player1Name,
        player2Name,
        matchType,
        bestOf,
        sets,
        games,
        points,
        isTiebreak,
        server,
        matchWinner,
        stats,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(`tennis-match-${matchId}`, JSON.stringify(matchData));
    }
  }, [matchStarted, player1Name, player2Name, matchType, bestOf, sets, games, points, isTiebreak, server, matchWinner, stats, matchId, isSpectator]);

  const generateMatchId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const loadMatch = (id) => {
    const savedMatch = localStorage.getItem(`tennis-match-${id}`);
    if (savedMatch) {
      const matchData = JSON.parse(savedMatch);
      setPlayer1Name(matchData.player1Name);
      setPlayer2Name(matchData.player2Name);
      setMatchType(matchData.matchType);
      setBestOf(matchData.bestOf);
      setSets(matchData.sets);
      setGames(matchData.games);
      setPoints(matchData.points);
      setIsTiebreak(matchData.isTiebreak);
      setServer(matchData.server);
      setMatchWinner(matchData.matchWinner);
      setStats(matchData.stats);
      setMatchStarted(true);
    }
  };

  const startMatch = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      alert('Please enter names for both players/teams');
      return;
    }
    setMatchStarted(true);

    // Update URL with match ID
    const url = new URL(window.location);
    url.searchParams.set('match', matchId);
    window.history.pushState({}, '', url);
  };

  const resetMatch = () => {
    if (confirm('Are you sure you want to reset the match?')) {
      setSets([0, 0]);
      setGames([[0, 0]]);
      setPoints([0, 0]);
      setIsTiebreak(false);
      setServer(0);
      setMatchWinner(null);
      setStats({
        player1: { aces: 0, doubleFaults: 0, winners: 0, unforcedErrors: 0, breakPointsWon: 0, breakPointsTotal: 0, firstServes: 0, firstServesIn: 0, totalPoints: 0 },
        player2: { aces: 0, doubleFaults: 0, winners: 0, unforcedErrors: 0, breakPointsWon: 0, breakPointsTotal: 0, firstServes: 0, firstServesIn: 0, totalPoints: 0 }
      });
      setHistory([]);
      setMatchStarted(false);

      // Clear localStorage
      if (matchId) {
        localStorage.removeItem(`tennis-match-${matchId}`);
      }

      // Clear URL
      const url = new URL(window.location);
      url.searchParams.delete('match');
      url.searchParams.delete('spectator');
      window.history.pushState({}, '', url);

      // Generate new match ID
      const newId = generateMatchId();
      setMatchId(newId);
    }
  };

  const saveHistory = () => {
    setHistory(prev => [...prev, {
      sets: [...sets],
      games: games.map(g => [...g]),
      points: [...points],
      isTiebreak,
      server,
      stats: JSON.parse(JSON.stringify(stats))
    }]);
  };

  const undo = () => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];
    setSets(lastState.sets);
    setGames(lastState.games);
    setPoints(lastState.points);
    setIsTiebreak(lastState.isTiebreak);
    setServer(lastState.server);
    setStats(lastState.stats);
    setHistory(prev => prev.slice(0, -1));
  };

  const addPoint = (player, statType = null) => {
    if (matchWinner || isSpectator) return;

    saveHistory();

    // Update total points
    const newStats = { ...stats };
    const playerKey = player === 0 ? 'player1' : 'player2';
    newStats[playerKey].totalPoints++;

    // Update specific stat if provided
    if (statType && showStatInput) {
      newStats[playerKey][statType]++;
    }
    setStats(newStats);

    let newPoints = [...points];
    let newGames = [...games];
    let newSets = [...sets];

    if (isTiebreak) {
      // Tiebreak scoring
      newPoints[player]++;

      // Check if tiebreak is won
      if (newPoints[player] >= 7 && newPoints[player] - newPoints[1 - player] >= 2) {
        // Tiebreak won
        const currentSetIndex = newGames.length - 1;
        newGames[currentSetIndex][player]++;
        newPoints = [0, 0];
        setIsTiebreak(false);

        // Check if set is won
        checkSetWin(newGames, newSets, player);
      } else {
        setPoints(newPoints);
      }

      // Change server every 2 points in tiebreak
      const totalPoints = newPoints[0] + newPoints[1];
      if (totalPoints % 2 === 1) {
        setServer(1 - server);
      }
    } else {
      // Regular scoring
      newPoints[player]++;

      // Check for game win
      if (newPoints[player] >= 4 && newPoints[player] - newPoints[1 - player] >= 2) {
        // Game won
        const currentSetIndex = newGames.length - 1;
        newGames[currentSetIndex][player]++;
        newPoints = [0, 0];

        // Change server
        setServer(1 - server);

        // Check for tiebreak
        if (newGames[currentSetIndex][0] === 6 && newGames[currentSetIndex][1] === 6) {
          setIsTiebreak(true);
        } else {
          // Check for set win
          checkSetWin(newGames, newSets, player);
        }

        setPoints(newPoints);
        setGames(newGames);
      } else {
        setPoints(newPoints);
      }
    }
  };

  const checkSetWin = (newGames, newSets, player) => {
    const currentSetIndex = newGames.length - 1;
    const playerGames = newGames[currentSetIndex][player];
    const opponentGames = newGames[currentSetIndex][1 - player];

    // Set won if: 6 games with 2+ game lead, or 7 games (after tiebreak)
    if ((playerGames >= 6 && playerGames - opponentGames >= 2) || playerGames === 7) {
      newSets[player]++;
      setSets(newSets);

      // Check for match win
      const setsToWin = Math.ceil(bestOf / 2);
      if (newSets[player] >= setsToWin) {
        setMatchWinner(player);
      } else {
        // Start new set
        newGames.push([0, 0]);
        setGames(newGames);
      }
    } else {
      setGames(newGames);
    }
  };

  const getPointDisplay = (playerPoints, opponentPoints) => {
    if (isTiebreak) {
      return playerPoints.toString();
    }

    const pointNames = ['0', '15', '30', '40'];

    if (playerPoints <= 3 && opponentPoints <= 3) {
      if (playerPoints === 3 && opponentPoints === 3) {
        return 'Deuce';
      }
      return pointNames[playerPoints];
    }

    if (playerPoints === opponentPoints) {
      return 'Deuce';
    }

    if (playerPoints > opponentPoints) {
      return 'Ad';
    }

    return '40';
  };

  const shareMatch = () => {
    const url = `${window.location.origin}${window.location.pathname}?match=${matchId}&spectator=true`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Spectator link copied to clipboard! Others can watch the match live by opening this link.');
    }).catch(() => {
      prompt('Copy this link to share:', url);
    });
  };

  const getMatchTypeDisplay = (type) => {
    const types = {
      'mens-singles': "Men's Singles",
      'womens-singles': "Women's Singles",
      'mens-doubles': "Men's Doubles",
      'womens-doubles': "Women's Doubles",
      'mixed-doubles': 'Mixed Doubles'
    };
    return types[type] || type;
  };

  const StatButton = ({ player, label, statKey }) => (
    <button
      onClick={() => {
        const newStats = { ...stats };
        const playerKey = player === 0 ? 'player1' : 'player2';
        newStats[playerKey][statKey]++;
        setStats(newStats);
      }}
      className="px-2 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 rounded transition-colors"
    >
      {label}
    </button>
  );

  if (!matchStarted) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-full p-4 ${theme.font}`}>
        <SEO
          title="Tennis Scoring Tool"
          description="Track tennis match scores in real-time with standard scoring, tiebreaks, match statistics, and shareable live updates"
          keywords="tennis, scoring, match tracker, live score, tennis statistics, sports"
        />

        <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-8 shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold text-white">Tennis Scoring</h1>
          </div>

          <div className="space-y-6">
            {/* Player Names */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Player/Team 1 Name
                </label>
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Player/Team 2 Name
                </label>
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name..."
                />
              </div>
            </div>

            {/* Match Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Match Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'mens-singles', label: "Men's Singles" },
                  { value: 'womens-singles', label: "Women's Singles" },
                  { value: 'mens-doubles', label: "Men's Doubles" },
                  { value: 'womens-doubles', label: "Women's Doubles" },
                  { value: 'mixed-doubles', label: 'Mixed Doubles' }
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => setMatchType(type.value)}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      matchType === type.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Best Of */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Match Format
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setBestOf(3)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    bestOf === 3
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Best of 3 Sets
                </button>
                <button
                  onClick={() => setBestOf(5)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    bestOf === 5
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Best of 5 Sets
                </button>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startMatch}
              className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Match
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-full p-4 ${theme.font}`}>
      <SEO
        title="Tennis Scoring Tool"
        description="Track tennis match scores in real-time with standard scoring, tiebreaks, match statistics, and shareable live updates"
        keywords="tennis, scoring, match tracker, live score, tennis statistics, sports"
      />

      <div className="w-full max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h1 className="text-2xl font-bold text-white">Tennis Match</h1>
                {isSpectator && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    Spectator Mode
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {getMatchTypeDisplay(matchType)} • Best of {bestOf}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {isSpectator && (
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    autoRefresh
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {autoRefresh ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  Auto-refresh
                </button>
              )}

              {!isSpectator && (
                <>
                  <button
                    onClick={undo}
                    disabled={history.length === 0}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Undo2 className="w-4 h-4" />
                    Undo
                  </button>

                  <button
                    onClick={shareMatch}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </>
              )}

              <button
                onClick={() => setShowStats(!showStats)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </button>

              {!isSpectator && (
                <button
                  onClick={resetMatch}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Match Winner */}
        {matchWinner !== null && (
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 shadow-xl text-center">
            <Trophy className="w-16 h-16 text-white mx-auto mb-2" />
            <h2 className="text-3xl font-bold text-white mb-1">
              {matchWinner === 0 ? player1Name : player2Name} Wins!
            </h2>
            <p className="text-white/90">
              {sets[0]} - {sets[1]} Sets
            </p>
          </div>
        )}

        {/* Scoreboard */}
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-900 text-gray-400 text-sm font-semibold">
            <div className="col-span-4 md:col-span-3 px-4 py-3">Player</div>
            {games.map((_, idx) => (
              <div key={idx} className="col-span-1 px-2 py-3 text-center border-l border-gray-700">
                S{idx + 1}
              </div>
            ))}
            {games.length < bestOf && (
              <div className="col-span-1 px-2 py-3 text-center border-l border-gray-700">
                {isTiebreak ? 'TB' : 'G'}
              </div>
            )}
            <div className="col-span-2 px-2 py-3 text-center border-l border-gray-700">
              {isTiebreak ? 'Tiebreak' : 'Points'}
            </div>
          </div>

          {/* Player 1 */}
          <div className={`grid grid-cols-12 border-b border-gray-700 ${server === 0 ? 'bg-blue-900/30' : ''}`}>
            <div className="col-span-4 md:col-span-3 px-4 py-4 font-semibold text-white flex items-center gap-2">
              {server === 0 && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
              {player1Name}
            </div>
            {games.map((setGames, idx) => (
              <div key={idx} className="col-span-1 px-2 py-4 text-center text-xl font-bold text-white border-l border-gray-700">
                {setGames[0]}
              </div>
            ))}
            {games.length < bestOf && (
              <div className="col-span-1 px-2 py-4 text-center text-xl font-bold text-white border-l border-gray-700">
                {games[games.length - 1][0]}
              </div>
            )}
            <div className="col-span-2 px-2 py-4 text-center border-l border-gray-700">
              <div className="text-2xl font-bold text-white">
                {getPointDisplay(points[0], points[1])}
              </div>
              {!isSpectator && !matchWinner && (
                <button
                  onClick={() => addPoint(0)}
                  className="mt-2 px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  +Point
                </button>
              )}
            </div>
          </div>

          {/* Player 2 */}
          <div className={`grid grid-cols-12 ${server === 1 ? 'bg-blue-900/30' : ''}`}>
            <div className="col-span-4 md:col-span-3 px-4 py-4 font-semibold text-white flex items-center gap-2">
              {server === 1 && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
              {player2Name}
            </div>
            {games.map((setGames, idx) => (
              <div key={idx} className="col-span-1 px-2 py-4 text-center text-xl font-bold text-white border-l border-gray-700">
                {setGames[1]}
              </div>
            ))}
            {games.length < bestOf && (
              <div className="col-span-1 px-2 py-4 text-center text-xl font-bold text-white border-l border-gray-700">
                {games[games.length - 1][1]}
              </div>
            )}
            <div className="col-span-2 px-2 py-4 text-center border-l border-gray-700">
              <div className="text-2xl font-bold text-white">
                {getPointDisplay(points[1], points[0])}
              </div>
              {!isSpectator && !matchWinner && (
                <button
                  onClick={() => addPoint(1)}
                  className="mt-2 px-4 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  +Point
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        {showStats && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Match Statistics
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Player 1 Stats */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 border-b border-gray-700 pb-2">
                  {player1Name}
                </h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Aces:</span>
                    <span className="font-semibold">{stats.player1.aces}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Double Faults:</span>
                    <span className="font-semibold">{stats.player1.doubleFaults}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Winners:</span>
                    <span className="font-semibold">{stats.player1.winners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unforced Errors:</span>
                    <span className="font-semibold">{stats.player1.unforcedErrors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Points Won:</span>
                    <span className="font-semibold">{stats.player1.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Break Points Won:</span>
                    <span className="font-semibold">
                      {stats.player1.breakPointsWon}/{stats.player1.breakPointsTotal}
                      {stats.player1.breakPointsTotal > 0 &&
                        ` (${Math.round(stats.player1.breakPointsWon / stats.player1.breakPointsTotal * 100)}%)`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>First Serve %:</span>
                    <span className="font-semibold">
                      {stats.player1.firstServes > 0
                        ? `${Math.round(stats.player1.firstServesIn / stats.player1.firstServes * 100)}%`
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>

                {!isSpectator && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Quick Stats:</p>
                    <div className="flex flex-wrap gap-2">
                      <StatButton player={0} label="Ace" statKey="aces" />
                      <StatButton player={0} label="DF" statKey="doubleFaults" />
                      <StatButton player={0} label="Winner" statKey="winners" />
                      <StatButton player={0} label="UE" statKey="unforcedErrors" />
                    </div>
                  </div>
                )}
              </div>

              {/* Player 2 Stats */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 border-b border-gray-700 pb-2">
                  {player2Name}
                </h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Aces:</span>
                    <span className="font-semibold">{stats.player2.aces}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Double Faults:</span>
                    <span className="font-semibold">{stats.player2.doubleFaults}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Winners:</span>
                    <span className="font-semibold">{stats.player2.winners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unforced Errors:</span>
                    <span className="font-semibold">{stats.player2.unforcedErrors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Points Won:</span>
                    <span className="font-semibold">{stats.player2.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Break Points Won:</span>
                    <span className="font-semibold">
                      {stats.player2.breakPointsWon}/{stats.player2.breakPointsTotal}
                      {stats.player2.breakPointsTotal > 0 &&
                        ` (${Math.round(stats.player2.breakPointsWon / stats.player2.breakPointsTotal * 100)}%)`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>First Serve %:</span>
                    <span className="font-semibold">
                      {stats.player2.firstServes > 0
                        ? `${Math.round(stats.player2.firstServesIn / stats.player2.firstServes * 100)}%`
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>

                {!isSpectator && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Quick Stats:</p>
                    <div className="flex flex-wrap gap-2">
                      <StatButton player={1} label="Ace" statKey="aces" />
                      <StatButton player={1} label="DF" statKey="doubleFaults" />
                      <StatButton player={1} label="Winner" statKey="winners" />
                      <StatButton player={1} label="UE" statKey="unforcedErrors" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info for spectators */}
        {isSpectator && (
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm text-center">
              You are viewing this match in spectator mode. {autoRefresh ? 'Auto-refreshing every 2 seconds.' : 'Enable auto-refresh to see live updates.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TennisScoring;
