import React, { useState, useEffect } from "react";
import PhotoTagging from "./PhotoTagging";
import Home from "./Home";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [characters, setCharacters] = useState([]);

  const startGame = () => {
    setGameStarted(true);
  };

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
    return () => clearInterval(intervalId);
  }, [gameStarted]);

  useEffect(() => {
    fetch("http://localhost:3000/api/characters")
      .then((response) => response.json())
      .then((data) => {
        setCharacters(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("An error occurred while fetching characters:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>findEM</h1>
        <h2 className="timer">Timer: {elapsedTime}</h2>
        <div className="charactersHeaderContainer">
          {" "}
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

        {gameStarted ? <button onClick={restartGame}>Retry</button> : null}
      </div>
      <div className="home">
        {gameStarted ? null : <button onClick={startGame}>Start Game</button>}
        {gameStarted ? <PhotoTagging /> : <Home />}
      </div>
    </div>
  );
}

export default App;
