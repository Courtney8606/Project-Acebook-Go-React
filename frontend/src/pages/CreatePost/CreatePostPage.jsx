import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postCreate } from "../../services/createpost";
import "/src/CreatePostPage.css";

export const CreatePostPage = () => {
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const maxnumber = 280;

  const handleChange = (event) => {
    const inputValue = event.target.value;
    const limitedValue = inputValue.slice(0, maxnumber);
    setValue(limitedValue);
    if (inputValue.length > maxnumber) {
      setErrorMessage(`Your message is too long, the limit is ${maxnumber} characters`);
    }
  };


  const handleErrorResponse = async (response) => {
    try{
    let data = await response.json();
      if (data.message == "Post message empty") {
      setErrorMessage("Post message empty");
    // } else if (data.message === "Post message too long (must be less than or equal to 280 chars)") {
    //     setErrorMessage("Post message too long (must be less than or equal to 280 chars)");
    } else {
        setErrorMessage("An error has occurred. Please try again");
    }
  } catch (error) {
    console.error(error);
    setErrorMessage("An unknown error has occurred. Please try again");
    }
};

  const handleSubmit = async (event) => {
    const token = localStorage.getItem("token");
    console.log(token);
    event.preventDefault();
    const messageInput = document.getElementById("message");
    const messageValue = messageInput.value;
    if (token) {
      try {
        const response = await postCreate(messageValue, token);
        if (response.status != 201) {
          await handleErrorResponse(response);
        } else {
        navigate("/posts");
        }
      } catch (err) {
        console.error(err)
    }
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <form className="post-form" onSubmit={handleSubmit}>
        <h1 className="post-title">Create Post</h1>
        <div className="icon-post">
          <i className="fas fa-user-circle"></i>
        </div>
        <label htmlFor="message">Enter your message:</label>
        <br></br>
        <input
          style={{ width: "300px", height: "100px", paddingLeft: "20px" }}
          id="message"
          type="text"
          value={value}
          onChange={handleChange}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button
          className="create-post-button"
          role="submit-button"
          type="submit"
          id="submit"
          value="Submit"
        >
          Submit
        </button>
    
      </form>
    </>
  );
};
