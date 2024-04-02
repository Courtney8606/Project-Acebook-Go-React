import React from "react";
import "/src/LikeButton.css";

const LikeButton = (props) => {
  const heartColour = props.liked ? "#ff6666" : "grey";

  return (
    <div>
      <button
        className="like"
        id="like-button"
        onClick={() => {
          props.onToggleLike();
        }}
      >
        <i className="fa fa-heart" style={{ color: heartColour }}>
          {props.likes}
        </i>
      </button>
    </div>
  );
};

export default LikeButton;
