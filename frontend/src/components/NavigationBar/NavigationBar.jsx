import { Link, useNavigate } from "react-router-dom";
import "./NavigationBar.css";

// NavigationBar will render at the top of the page. The <nav>
// tag identifies it as the navigation information for the site
const NavigationBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Set functions for the different buttons on the navbar
  const logout = () => {
    // Removes the stored login token from browser's localStorage
    localStorage.removeItem('token')
    navigate("/login");
  };

  const login = () => {
    navigate('/login');
  };

  const signup = () => {
    navigate('/signup');
  };

  const createPost = () => {
    navigate('/createpost');
  };



  const renderButtons = () => {
    const currentURL = window.location.href;
    if ( currentURL !== 'http://localhost:5173/' ) {
      if (token !== null) {
        return (
          <div>
            <button className='navbarButton' role='createPostButton' onClick={createPost}>Create post</button>
            <button className='navbarButton' role='logoutButton' onClick={logout}>Logout</button>
          </div>
        );
      } else {
        return (
          <div>
            <button className='navbarButton' role='loginButton' onClick={login}>Login</button>
            <button className='navbarButton' role='signupButton' onClick={signup}>Signup</button>
          </div>
        );
      }
    }
  };

  return (
    <nav>
      <div className='navbarBox'>
        <Link to="/" className="navbarLogo">
          <h1>Acebook</h1>
        </Link>
        <div className='navbarButtons'>
          {renderButtons()}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;