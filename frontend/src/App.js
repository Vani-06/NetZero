import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // --- APP NAVIGATION & AUTH STATE ---
  const [currentScreen, setCurrentScreen] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [tutorialStep, setTutorialStep] = useState(1);

  // --- GAME STATE ---
  const [credits, setCredits] = useState(0);
  const [level, setLevel] = useState("Energy Beginner");
  const [treeBaby, setTreeBaby] = useState("🌱");
  const [nextTarget, setNextTarget] = useState(100);

  useEffect(() => {
    if (currentScreen === 'game') {
      axios.get('http://localhost:5000/api/user')
        .then(res => updateProgress(res.data.totalCredits))
        .catch(err => console.error("Backend running?", err));
    }
  }, [currentScreen]);

  const updateProgress = (currentCredits) => {
    setCredits(currentCredits);
    if (currentCredits <= 100) {
      setLevel("Energy Beginner 🥉"); setTreeBaby("🌱"); setNextTarget(100);
    } else if (currentCredits <= 250) {
      setLevel("Carbon Controller 🥈"); setTreeBaby("🌿"); setNextTarget(250);
    } else if (currentCredits <= 500) {
      setLevel("Net-Zero Warrior 🥇"); setTreeBaby("🪴"); setNextTarget(500);
    } else {
      setLevel("Planet Protector 💎"); setTreeBaby("🌳"); setNextTarget(currentCredits);
    }
  };

  const logActivity = (activity) => {
    axios.post('http://localhost:5000/api/log-activity', { activityType: activity })
      .then(res => updateProgress(res.data.newTotal))
      .catch(err => console.error(err));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.includes('@') && password.length > 3) {
      // Create a cute display name from the email (e.g., "vani@email.com" -> "vani")
      setDisplayName(email.split('@')[0]);
      setCurrentScreen('tutorial'); 
    } else {
      alert("Please enter a valid email and a password.");
    }
  };

  // --- 1. EMAIL LOGIN SCREEN ---
  if (currentScreen === 'login') {
    return (
      <div className="game-container">
        <div className="icon-header">🌍</div>
        <h1 className="title">EcoStep</h1>
        <p className="subtitle">Sign in to save the planet.</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cute-input"
              required
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cute-input"
              required
            />
          </div>
          <button type="submit" className="primary-btn bounce-hover">Sign In & Play</button>
        </form>
      </div>
    );
  }

  // --- 2. TUTORIAL SCREEN ---
  if (currentScreen === 'tutorial') {
    return (
      <div className="game-container">
        <h2 className="title">How to Play 📖</h2>
        
        {tutorialStep === 1 && (
          <div className="cute-card">
            <div className="tutorial-icon">♻️</div>
            <h3>1. Log Green Actions</h3>
            <p>Track your real-life eco-friendly habits.</p>
            <button className="primary-btn bounce-hover" onClick={() => setTutorialStep(2)}>Next</button>
          </div>
        )}

        {tutorialStep === 2 && (
          <div className="cute-card">
            <div className="tutorial-icon">🪙</div>
            <h3>2. Earn Credits</h3>
            <p>Every action gives you Carbon Credits.</p>
            <button className="primary-btn bounce-hover" onClick={() => setTutorialStep(3)}>Next</button>
          </div>
        )}

        {tutorialStep === 3 && (
          <div className="cute-card">
            <div className="tutorial-icon">🌳</div>
            <h3>3. Grow Your Tree</h3>
            <p>Level up and watch your tree baby evolve!</p>
            <button className="primary-btn bounce-hover" onClick={() => setCurrentScreen('game')}>Let's Play!</button>
          </div>
        )}
      </div>
    );
  }

  // --- 3. MAIN GAME SCREEN ---
  const progressPercentage = Math.min((credits / nextTarget) * 100, 100);

  return (
    <div className="game-container">
      <header className="header">
        <h1>EcoStep</h1>
        <p className="greeting">Welcome back, <span className="highlight-name">{displayName}</span>!</p>
      </header>

      <div className="cute-card stats-board">
        <div className="tree-display">{treeBaby}</div>
        <h2 className="level-text">{level}</h2>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="progress-text">{credits} / {nextTarget} Credits</p>
        </div>
      </div>

      <div className="action-buttons">
        <button className="cute-btn bounce-hover" onClick={() => logActivity('saving_energy')}>💡 Turned off lights (+10)</button>
        <button className="cute-btn bounce-hover" onClick={() => logActivity('recycling')}>♻️ Recycled Waste (+20)</button>
        <button className="cute-btn bounce-hover" onClick={() => logActivity('sustainable_transport')}>🚌 Took the Bus (+30)</button>
        <button className="cute-btn bounce-hover" onClick={() => logActivity('planting_trees')}>🌱 Planted a Tree (+50)</button>
      </div>
    </div>
  );
}

export default App;