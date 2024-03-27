import { useNavigate } from "react-router-dom";

import "./NavigationBar.css";

// NavigationBar will render at the top of the page. The <nav>
// tag identifies it as the navigation information for the site
const NavigationBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const logout = () => {
    // Removes the stored login token from browser's localStorage
    localStorage.removeItem('token')
    navigate("/login");
  };

  const login = () => {
    navigate('/login')
  };

  const signup = () => {
    navigate('/signup')
  };

if (token != null) {
  return (
    <button onClick={logout}>Logout</button>
  )}

else if (token === null) {
  return (
    <div>
    <button onClick={login}>Login</button>
    <button onClick={signup}>Signup</button>
    </div>
  )}
};

export default NavigationBar;