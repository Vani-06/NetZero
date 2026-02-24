import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [credits, setCredits] = useState(0);
  const [level, setLevel] = useState("Energy Beginner");
  const [treeBaby, setTreeBaby] = useState("🌱");

  // Fetch initial data from our Node backend when the page loads
  useEffect(() => {
    axios.get('http://localhost:5000/api/user')
      .then(res => updateProgress(res.data.totalCredits))
      .catch(err => console.error("Make sure your backend is running!", err));
  }, []);

  // Update level and the cute tree baby based on your presentation's logic
  const updateProgress = (currentCredits) => {
    setCredits(currentCredits);
    if (currentCredits <= 100) {
      setLevel("Energy Beginner 🥉");
      setTreeBaby("🌱");
    } else if (currentCredits <= 250) {
      setLevel("Carbon Controller 🥈");
      setTreeBaby("🌿");
    } else if (currentCredits <= 500) {
      setLevel("Net-Zero Warrior 🥇");
      setTreeBaby("🪴");
    } else {
      setLevel("Planet Protector 💎");
      setTreeBaby("🌳");
    }
  };

  // Send the action to the backend
  const logActivity = (activity) => {
    axios.post('http://localhost:5000/api/log-activity', { activityType: activity })
      .then(res => updateProgress(res.data.newTotal))
      .catch(err => console.error(err));
  };

  return (
    <div className="game-container">
      <header className="header">
        <h1>EcoStep 🌍</h1>
        <p>Log green activities to grow your Tree Baby!</p>
      </header>

      <div className="stats-board">
        <div className="tree-display">{treeBaby}</div>
        <h2>{level}</h2>
        <p className="credits">Carbon Credits: <strong>{credits}</strong></p>
      </div>

      <div className="action-buttons">
        <button onClick={() => logActivity('saving_energy')}>Turned off lights (+10)</button>
        <button onClick={() => logActivity('recycling')}>Recycled Waste (+20)</button>
        <button onClick={() => logActivity('sustainable_transport')}>Took the Bus (+30)</button>
        <button onClick={() => logActivity('planting_trees')}>Planted a Tree (+50)</button>
      </div>
    </div>
  );
}

export default App;