import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/Signup.css";
import { signup } from "../../services/authentication";

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

    const clearFormFields = () => {
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      document.getElementById("username").value = "";
    };

    const handleErrorResponse = async (response) => {
      try{
      let data = await response.json();
        if (data.message == "Must supply email, username and password") {
        setErrorMessage("Please input both a valid email address, username and a password");
      } else if (data.message === "Invalid email address") {
          setErrorMessage("Please include a valid email address");
          clearFormFields();
      } else if (data.message === "Email address already in use") {
          setErrorMessage("This email address is already in use. Please log in or sign up with a different email address");
          document.getElementById("password").value = "";
      } else if (data.message === "Username already in use") {
        setErrorMessage("This username is already in use. Please log in or sign up with a different username");
        document.getElementById("password").value = "";
      } else {
          setErrorMessage("An error has occurred. Please try again");
          clearFormFields();
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An unknown error has occurred. Please try again");
      }
  };
  
  const handleSubmit = async (event) => {
      event.preventDefault();
      try {
          const response = await signup(email, password, username);
          console.log(response);
          if (response.status != 201) {
              await handleErrorResponse(response);
          } else {
              console.log("redirecting...:");
              navigate("/login");
          }
      } catch (err) {
          console.error(err)
      }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  return (
    <>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <div className="icon-signup">
          <i className="fas fa-user-circle"></i>
        </div>
        <label htmlFor="email"></label>
        <input
          placeholder="Email"
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
          className="signup-input"
        />
                <br></br>
        <label htmlFor="username"></label>
        <input
          placeholder="Username"
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          className="signup-input"
        />
        <br></br>
        <label htmlFor="password"></label>
        <input
          placeholder="Password"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="signup-input"
        />
        <input
          className="signup-button"
          role="submit-button"
          id="submit"
          type="submit"
          value="Submit"
        />
        
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </>
  );
};
