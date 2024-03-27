import React, { useState } from "react";
import "/src/LikeButton.css";

const LikeButton = (props) => {
  const [heartColor, setHeartColor] = useState("grey");
  const [count, setCount] = useState(0);
  //   Need to input stored useState eg. props.post.count

  const toggleLike = () => {
    if (heartColor === "grey") {
      setHeartColor("#ff6666");
      setCount(count + 1);
    } else {
      setHeartColor("grey");
      setCount(count - 1);
    }
  };

  return (
    <div>
      <button
        className="like"
        onClick={() => {
          toggleLike();
          props.onToggleLike();
        }}
      >
        <i className="fa fa-heart" style={{ color: heartColor }}>
          {count}
        </i>
        {props.liked ? "" : ""}
      </button>
    </div>
  );
};

export default LikeButton;
