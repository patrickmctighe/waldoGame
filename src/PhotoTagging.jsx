import React, { useState, useEffect, useRef } from 'react';

const PhotoTagging = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const characters = [
    <img className='smallImg' src="/images/Falcon.png" alt="" />,
    <img className='smallImg' src="/images/superman.png" alt="" />,
    <img className='smallImg' src="/images/yoda.png" alt="" />,
  ];

  const componentRef = useRef(null);
  const listRef = useRef(null);

  const handleGameImageClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (clickPosition && x === clickPosition.x && y === clickPosition.y) {
      // If the user clicks the same spot twice, don't change the state
      return;
    }

    setClickPosition({ x, y });
    setShowDropdown(true);
  };

  const handleListMouseLeave = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    // Event listener to close the dropdown when clicking outside
    function handleClickOutside(event) {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dropdownStyle = {
    position: 'absolute',
    top: clickPosition ? `${clickPosition.y + 65}px` : 0,
    left: clickPosition ? `${clickPosition.x - 120}px` : 0,
  };

  return (
    <div className="photo-tagging-container" ref={componentRef}>
      <div className="game-image" onClick={handleGameImageClick}>
        <img src="./public/images/gameImage.jpg" alt="Game Image" className="game-img" />
        {showDropdown && (
          <div>
            {clickPosition && (
              <div className="circle" style={{ top: clickPosition.y - 50, left: clickPosition.x - 50 }}></div>
            )}
            <div className="dropdown-menu" style={dropdownStyle} ref={listRef} onMouseLeave={handleListMouseLeave}>
              {characters.map((character, index) => (
                <div className="characterSelect" key={index} onClick={() => setSelectedCharacter(character)}>
                  {character} 
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoTagging;
