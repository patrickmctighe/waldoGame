import { set } from "lodash";
import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";

const PhotoTagging = (props) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greenCircle, setGreenCircle] = useState(false);
  const [redCircle, setRedCircle] = useState(false);
  const [score, setScore] = useState(0);
  const [initialScreenWidth, setInitialScreenWidth] = useState(window.innerWidth);
  const [initialScreenHeight, setInitialScreenHeight] = useState(window.innerHeight);
  const [alreadySelectedCharacters, setAlreadySelectedCharacters] = useState([]);

  const componentRef = useRef(null);
  const listRef = useRef(null);
  
  useEffect(() => {
    setInitialScreenWidth(window.innerWidth);
    setInitialScreenHeight(window.innerHeight);


    // Fetch characters when the component mounts
  
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

  useEffect(() => {
    function handleResize() {
      setInitialScreenWidth(window.innerWidth);
      setInitialScreenHeight(window.innerHeight);
    }
  
    // Attach the event listener when the component mounts
    window.addEventListener("resize", handleResize);
  
    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleGameImageClick = async (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    // Normalize the coordinates
    const xPercentage = (x / initialScreenWidth) * 100;
    const yPercentage = (y / initialScreenHeight) * 100;
  
    setClickPosition({ x, y });
  
    // Check if the click matches any character's location
    const matchingCharacter = characters.find((character) => {
      // Define a radius in percentage based on the initial screen size
      const radius = 15; //<- makes an radius for the matching click in pixels
      const isWithinRadius =
        Math.abs(character.x - xPercentage) <= radius &&
        Math.abs(character.y - yPercentage) <= radius;
      return isWithinRadius;
    });
  
    if (matchingCharacter) {
      setRedCircle(false);
      setSelectedCharacter(matchingCharacter);
      setShowDropdown(true);
      setGreenCircle(true);
    } else {
      // If no character is found at the click location, hide the dropdown
      setShowDropdown(false);
      setRedCircle(true);
    }
  
    await sendClickLocation(xPercentage, yPercentage, matchingCharacter ? matchingCharacter.name : null);
  };
  

  const handleListMouseLeave = () => {
    setShowDropdown(false);
  };


  const dropdownStyle = {
    position: "absolute",
    top: clickPosition ? `${clickPosition.y + 145}px` : 0,
    left: clickPosition ? `${clickPosition.x - 110}px` : 0,
  };

  const sendClickLocation = async (x, y, characterName) => {
    const data = { x, y ,characterName};
    try {
      const response = await fetch(
        "http://localhost:3000/api/saveClickLocation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Click location saved:", responseData.location);
      } else {
        console.error("Failed to save click location.");
      }
    } catch (error) {
      console.error("An error occurred while sending the request:", error);
    }
  };

  const handleCharacterSelect = (character) => {
    console.log("selected character", character);
    if (alreadySelectedCharacters.includes(character)) {
      // Do nothing if the same character is selected
      return;
    }
    // Check if the character has not been selected before
    else {
      // Increment the score
      setScore((prevscore) => prevscore + 1);
      setAlreadySelectedCharacters((prevSelectedCharacters) => [
        ...prevSelectedCharacters,
        character,
      ]);
    }
    // Check for the winning condition
    if (score + 1 === characters.length) {
      console.log("Congratulations! You won!");
      props.setGameEnded(true); // Update the gameEnded state using the setGameEnded prop
    }
    if (score === null) {
      console.log("no change");
    }
    console.log(character.name);
    console.log(score);
    // Always set the selected character
    setSelectedCharacter(character);
  };

  return (
    <div className="photo-tagging-container" ref={componentRef}>
      <div className="game-image" onClick={handleGameImageClick}>
        <img
          src="/images/gameImage.jpg"
          alt="Game Image"
          className="game-img"
        />
        {showDropdown && (
          <div>
            {greenCircle && (
              <div
                className="circle"
                style={{
                  top: clickPosition.y + 30,
                  left: clickPosition.x - 50,
                }}
              ></div>
            )}
            <div
              className="dropdown"
              style={dropdownStyle}
              ref={listRef}
              onMouseLeave={handleListMouseLeave}
            >
              {loading ? (
                <p>Loading characters...</p>
              ) : (
                <div className="characterSelectContainer">
                  {characters.map((character) => (
                    <div
                      key={character.name}
                      className="characterSelect"
                      onClick={() => handleCharacterSelect(character)}
                    >
                      <img
                        className="smallCharImg"
                        src={character.image}
                        alt={character.name}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {redCircle && (
          <div
            className="redCircle"
            style={{
              top: clickPosition.y + 30,
              left: clickPosition.x - 50,
            }}
          ></div>
        )}
      </div>
    </div>
  );


};

PhotoTagging.propTypes = {
  onGameEnd: PropTypes.func.isRequired,
  setGameEnded: PropTypes.func.isRequired,
  gameEnded: PropTypes.bool.isRequired,
};

export default PhotoTagging;
