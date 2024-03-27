import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/Login.css";
import { login } from "../../services/authentication";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/posts");
    } catch (err) {
      console.error(err);
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
      </form>
    </>
  );
};
