import React, { useState, useEffect } from 'react';

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/leaderboards")
            .then(response => response.json())
            .then(data => setLeaderboardData(data))
            .catch(error => console.error("Error fetching leaderboard data:", error));
    }, []);

    const sortedLeaderboardData = leaderboardData.sort((a, b) => b.score - a.score);

    return (
        <div className="scoreBoard">
            {sortedLeaderboardData.map((data, index) => (
                <div key={index}>
                    <p>Player Name: {data.name}</p>
                    <p>Player Score: {data.score}</p>
                </div>
            ))}
        </div>
    );
}

export default Leaderboard;