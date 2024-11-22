import React, { useState } from "react";

const RatingSelection = ({selectedRating, setSelectedRating}) => {
  const handleSelection = (rating) => {
    setSelectedRating(rating); // Updates the selected rating
  };

  return (
    <div className="row-2">
      <div className="selection-wrapper">
        <div className="selection">

          
          {[1, 2, 3, 4, 5].map((rating) => (
          <div
            key={rating}
            className={`chip-${rating + 2} ${selectedRating === rating ? "selected" : ""}`}  // Adjusted class name to map chip-3 to 1 star, chip-4 to 2 stars, etc.
            onClick={() => handleSelection(rating)}
            role="button"
            tabIndex={0}
            aria-label={`Rate ${rating} stars`} // Accessibility improvement
          >
            <span className={`text-${rating + 2}`}>{'⭐'.repeat(rating)}</span> {/* Adjusted to display the correct number of stars */}
          </div>
        ))}
      </div>
    </div>
    </div>
 
  );
};

export default RatingSelection;