import React, { useState, useEffect } from "react";

import PhotoTagging from "./PhotoTagging";
import Home from "./Home";
import LeaderboardForm from "./LeaderboardForm";
import Leaderboard from "./Leaderboard";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showLeaderboardForm, setShowLeaderboardForm] = useState(true);
const apiSite= "https://waldoapi-np2m.onrender.com"


  const restartGame = () => {
    setGameStarted(false);
    setElapsedTime(0);
  };

  useEffect(() => {
    let intervalId;
    if (gameStarted) {
      intervalId = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1);
      }, 1000);
    }
    if (gameEnded) {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [gameStarted, gameEnded]);

  useEffect(() => {
    fetch( apiSite + "/api/characters")
      .then((response) => response.json())
      .then((data) => {
        setCharacters(data);
      })
      .catch((error) => {
        console.error("An error occurred while fetching characters:", error);
      });
  }, []);

  const handleGameEnd = () => {
    setGameEnded(true);
  };

  const handleLeaderboardSubmit = (name, score) => {
    fetch(apiSite + "/api/leaderboard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, score }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        setShowLeaderboard(true);
        setShowLeaderboardForm(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  console.log("showLeaderboard:", showLeaderboard); // Log the value of showLeaderboard

  return (
    <div className="container">
      <div className="header">
        <h1 className="logo">SciFinder</h1>
        <div className="buttonAndImgs"><div className="charactersHeaderContainer">
        <h2 className="timerPart">Timer: {elapsedTime}</h2>

          <h2 className="charactersHeaderTitle">Characters:</h2>{" "}
          <div className="charactersInHeader">
            {characters.map((character) => (
              <div key={character.name} className="charactersHeader">
                <div className="headerImg">
                  {" "}
                  <img
                    className="smallCharImg"
                    src={character.image}
                    alt={character.name}
                  />
                </div>
                
              </div>
            ))}
          </div>
          
        </div>
<div className="retryBtnCont"> {gameStarted && !gameEnded ? (
          <button className="retryButton" onClick={restartGame}>Retry</button>
        ) : null}</div></div>
        
       
      </div>
      <div className="container">
        {gameEnded ? (
          <>
            {showLeaderboardForm ? (
              <div className="leaderboardForm">    <LeaderboardForm
              onSubmit={handleLeaderboardSubmit}
              score={elapsedTime}
              setShowLeaderboard={setShowLeaderboard}
              setShowLeaderboardForm={setShowLeaderboardForm}
            /></div>
          
            ) : null}
            {showLeaderboard ? (
              <Leaderboard showForm={showLeaderboardForm} />
            ) : null}
          </>
        ) : gameStarted ? (
          <PhotoTagging
            onGameEnd={handleGameEnd}
            setGameEnded={setGameEnded}
            gameEnded={gameEnded}
          />
        ) : (<div className="home">          <Home onGameStart={setGameStarted} />
</div>
        )}
      </div>
    </div>
  );
}

export default App;