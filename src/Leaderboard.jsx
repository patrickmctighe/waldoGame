import React, { useState, useEffect } from 'react';

function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const apiSite= "https://waldoapi-np2m.onrender.com"
    useEffect(() => {
        fetch(apiSite + "/api/leaderboards")
            .then(response => response.json())
            .then(data => setLeaderboardData(data))
            .catch(error => console.error("Error fetching leaderboard data:", error));
    }, []);

    const sortedLeaderboardData = leaderboardData.sort((a, b) => a.score - b.score);

    return (
        <div className="scoreBoard">
            <h1 className='leaderboardTitle'>Leaderboard</h1>
            {sortedLeaderboardData.map((data, index) => (
                <div className="playerScore"key={index}>
                    <div className="scoreListing">
                  <p className='listingTitle'>_Place_</p>
                  <p>{index+1}</p>
                   </div>
                   <div className="scoreListing">
                  <p  className='listingTitle'>_Name_</p>
                  <p>{data.name}</p>
                   </div>
                   <div className="scoreListing">
                  <p  className='listingTitle'> _Score_</p>
                  <p>{data.score}secs</p>
                   </div>
                    
                    
                </div>
            ))}
        </div>
    );
}

export default Leaderboard;