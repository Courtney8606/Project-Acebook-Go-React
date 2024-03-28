import { Link, useNavigate } from "react-router-dom";

import "./HomePage.css";

export const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const login = () => {
    if (token) {
      navigate('/posts');
    } else {
      navigate('/login');
    };
  };

  const signup = () => {
    navigate('/signup');
  };

  return (
    <div className="home">
      <h1>Welcome to Acebook!</h1>
      <h2>Acebook is the fastest growing app for sharing posts with pals</h2>
      <div className='homepageButtons'>
        <button role='loginButton' onClick={login}>Login</button>
        <button role='signupButton' onClick={signup}>Signup</button>
      </div>
    </div>
  );
};
