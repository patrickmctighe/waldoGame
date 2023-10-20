// Photo.js
import React, { useState } from 'react';

const Photo = () => {
  const [showTaggingBox, setShowTaggingBox] = useState(false);

  const handlePhotoClick = (event) => {
    setShowTaggingBox(!showTaggingBox);

    // Prevent click propagation to the document
    event.stopPropagation();
  };

  return (
    <div>
      <img src="your-photo.jpg" alt="Taggable Photo" onClick={handlePhotoClick} />
      {showTaggingBox && <TaggingBox />}
    </div>
  );
};

export default Photo;

