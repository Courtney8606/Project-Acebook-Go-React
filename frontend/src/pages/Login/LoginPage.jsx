import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/Login.css";
import { login } from "../../services/authentication";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleErrorResponse = async (response) => {
    try {
      let data = await response.json();
       if (data.message === "Password incorrect") {
        setErrorMessage("Password is incorrect. Please try again.");
        document.getElementById("password").value = "";
      } else {
        setErrorMessage("An error has occurred. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Email address not found. Please try a different email address or sign up.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(email, password);
      if (response.status != 201) {
        await handleErrorResponse(response);
      } else {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/posts");
    }
    } catch (err) {
      console.error("Error",err);
      navigate("/login");
    
  }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="icon-login">
          <i className="fas fa-user-circle"></i>
        </div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
          className="login-input"
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="login-input"
        />
        <input
          className="login-button"
          role="submit-button"
          id="submit"
          type="submit"
          value="Submit"
        />
         {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </>
  );
};
