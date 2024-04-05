import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { commentCreate, getComments } from "../../services/comments";
import FeedPage from "../../pages/Feed/FeedPage";
import "/src/CommentsBox.css";

export const CreateComment = (props) => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const maxnumber = 280;

  const handleChange = (event) => {
    const inputValue = event.target.value;
    const limitedValue = inputValue.slice(0, maxnumber);
    setValue(limitedValue);
    if (inputValue.length > maxnumber) {
      alert(`Your comment is too long, the limit is ${maxnumber} characters`);
    }
  };

  const handleSubmit = async (event) => {
    const token = localStorage.getItem("token");
    event.preventDefault();
    const commentInput = document.getElementById(`comment-${props.postid}`);
    const commentValue = commentInput.value;
    if (token) {
      await commentCreate(commentValue, props.postid, token);
      props.onCommentCreate();
      navigate("/posts");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <form className="commentform" onSubmit={handleSubmit}>
        <label htmlFor="comment"></label>
        <div className="icon-comment">
          <span className="comment-icon">&#x1F4AC;</span>
        </div>
        <br></br>
        <input
          style={{ width: "300px", height: "50px", paddingLeft: "20px" }}
          id={`comment-${props.postid}`}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Enter your comment"
        />
        <button
          className="create-comment-button"
          role="submit-button"
          type="submit"
          id="submit"
          value="Submit"
          alt="comment-button"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default CreateComment;
