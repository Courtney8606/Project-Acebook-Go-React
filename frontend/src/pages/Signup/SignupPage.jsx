import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/Signup.css";
import { signup } from "../../services/authentication";

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signup(email, password);
      console.log("redirecting...:");
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/signup");
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
    </>
  );
};
