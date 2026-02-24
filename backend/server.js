const express = require('express');
const cors = require('cors');
const app = express();

// These allow our backend to talk to our React frontend securely
app.use(cors());
app.use(express.json());

// Our temporary "database" to hold the user's score
let userCredits = 0;

// The point values from your presentation
const activities = {
    "saving_energy": 10,
    "recycling": 20,
    "sustainable_transport": 30,
    "planting_trees": 50
};

// Route 1: The frontend asks for the current score
app.get('/api/user', (req, res) => {
    res.json({ totalCredits: userCredits });
});

// Route 2: The frontend tells us the user did a green activity
app.post('/api/log-activity', (req, res) => {
    const { activityType } = req.body;
    
    // Check if the activity exists, then add the points
    if (activities[activityType]) {
        userCredits += activities[activityType];
        console.log(`Awesome! Added ${activities[activityType]} credits. Total is now: ${userCredits}`);
        res.json({ message: "Activity logged!", newTotal: userCredits });
    } else {
        res.status(400).json({ error: "Invalid activity" });
    }
});

// Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🌿 EcoStep backend running on http://localhost:${PORT}`);
});