import { useNavigate } from "react-router-dom";

// This component is a button which logs out the user.
// It delete the stored token and then navigates
// To the /login page
const SignoutButton = () => {
  
  // JS
  const navigate = useNavigate();

  const logout = () => {
    // Removes the stored login token from browser's localStorage
    localStorage.removeItem('token');
    navigate('/login');
  };

  // HTML
  return (
    <button onClick={logout}>Logout</button>
  );
};

export default SignoutButton;