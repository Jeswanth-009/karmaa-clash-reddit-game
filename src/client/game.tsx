import { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { showToast } from '@devvit/web/client';
import './index.css';

// Define the structure for our Reddit Posts
interface RedditPost {
  title: string;
  sub: string;
  upvotes: number;
}

interface PostPair {
  left: RedditPost;
  right: RedditPost;
}

export const Game = () => {
  const [dailyPairs, setDailyPairs] = useState<PostPair[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'playing' | 'revealed' | 'finished'>('playing');
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);

  // 1. FETCH LIVE DATA FROM REDDIT API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // This calls your server-side route (src/server/routes/api.ts)
        const response = await fetch('/api/get-posts');
        const data = await response.json();
        
        // Group the 10 fetched posts into 5 pairs
        const pairs: PostPair[] = [];
        for (let i = 0; i < data.length; i += 2) {
          if (data[i + 1]) {
            pairs.push({ left: data[i], right: data[i + 1] });
          }
        }
        setDailyPairs(pairs);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch live Reddit data", err);
        setLoading(false);
      }
    };

    void fetchPosts();
  }, []);

  const currentPair = dailyPairs[index];

  const handleChoice = (side: 'left' | 'right') => {
    if (gameState !== 'playing' || !currentPair) return;

    setSelectedSide(side);
    setGameState('revealed');

    const leftWins = currentPair.left.upvotes >= currentPair.right.upvotes;
    const isCorrect = (side === 'left' && leftWins) || (side === 'right' && !leftWins);

    if (isCorrect) {
      setScore(s => s + 1);
      showToast({ text: 'Correct! 🚀', appearance: 'success' });
    } else {
      showToast({ text: 'Wrong! 💀', appearance: 'neutral' });
    }

    // Auto-advance after 2 seconds
    setTimeout(() => {
      if (index < dailyPairs.length - 1) {
        setIndex(i => i + 1);
        setGameState('playing');
        setSelectedSide(null);
      } else {
        setGameState('finished');
      }
    }, 2000);
  };

  const copyResult = () => {
    const text = `I scored ${score}/${dailyPairs.length} on Karma Clash today! 🚀`;
    // Void operator handles the promise for the linter
    void navigator.clipboard.writeText(text);
    showToast({ text: 'Copied to clipboard!', appearance: 'success' });
  };

  const fmt = (n: number) => n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString();

  if (loading) return <div className="container center"><h1>Loading Daily Posts...</h1></div>;

  if (gameState === 'finished') {
    return (
      <div className="container end-screen">
        <h1>GAME OVER</h1>
        <div className="final-score">{score} / {dailyPairs.length}</div>
        <p>Your Daily Karma IQ</p>
        <button className="btn-primary" onClick={copyResult}>SHARE SCORE 📋</button>
      </div>
    );
  }

  if (!currentPair) return <div className="container center"><h1>No posts available</h1></div>;

  return (
    <div className="container">
      <div className="header">
        <span className="logo-text">KARMA CLASH</span>
        <span className="progress">{index + 1} / {dailyPairs.length}</span>
      </div>

      <div className="battle-arena">
        {/* LEFT CARD */}
        <div 
          className={`card ${selectedSide === 'left' ? 'picked' : ''}`}
          onClick={() => handleChoice('left')}
        >
          <div className="sub">r/{currentPair.left.sub}</div>
          <div className="title">{currentPair.left.title}</div>
          {gameState === 'revealed' && (
            <div className="votes animate-pop">{fmt(currentPair.left.upvotes)} ⬆</div>
          )}
        </div>

        <div className="vs-badge">VS</div>

        {/* RIGHT CARD */}
        <div 
          className={`card ${selectedSide === 'right' ? 'picked' : ''}`}
          onClick={() => handleChoice('right')}
        >
          <div className="sub">r/{currentPair.right.sub}</div>
          <div className="title">{currentPair.right.title}</div>
          {gameState === 'revealed' && (
            <div className="votes animate-pop">{fmt(currentPair.right.upvotes)} ⬆</div>
          )}
        </div>
      </div>

      <div className="instruction">
        {gameState === 'playing' ? "Which post has MORE Upvotes?" : "Analyzing results..."}
      </div>
    </div>
  );
};

// INITIALIZE THE APP
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Game />
    </StrictMode>
  );
}