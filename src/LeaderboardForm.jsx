//LeaderboardForm.jsx
import React, { useState } from "react";

const LeaderboardForm = ({ score, setShowLeaderboard }) => {
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
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Score:
        <input type="text" value={score} disabled />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default LeaderboardForm;