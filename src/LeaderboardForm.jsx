//LeaderboardForm.jsx
import React, { useState } from "react";

const LeaderboardForm = ({ score, setShowLeaderboard , setShowLeaderboardForm}) => {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:3000/api/leaderboards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, score }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setShowLeaderboard(true);
        setShowLeaderboardForm(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div >
      <div className="homeHeader"><h1>Leaderboard Form</h1>
    <h3>Great Job! You found all the hidden characters!</h3>
    <h3>Enter your name to be added to the leaderboard!</h3>
    <h1>
      {score} Seconds
    </h1></div>
    <form className="leaderboardForm2" onSubmit={handleSubmit}>
      <label>
        Name <br />
        <input
className="nameInput"
type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <br />
      <div className="labelAndScore"> <label>
         <br /> Score  <br />
        <input className="scoreInput" type="text" value={score} disabled />
      </label></div>
     
      <br />
      <button className="submitButton" type="submit">Submit</button>
    </form>
    </div>
  );
};

export default LeaderboardForm;