import { Link, useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import logoImage from "../../assets/acebook-logo-img.png"
import logoText from "../../assets/acebook-logo-text.png"

// NavigationBar will render at the top of the page. The <nav>
// tag identifies it as the navigation information for the site
const NavigationBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // grabbing token from browser storage sent by server IF logged in
  // using it WHILE user stays logged in ?
  const username = localStorage.getItem("username");

  // Set functions for the different buttons on the navbar
  const logout = () => {
    // Removes the stored login info from browser's localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('userID')
    localStorage.removeItem('username')
    navigate("/login");
  };

  const posts = () => {
    navigate('/posts');
  };

  const createPost = () => {
    navigate('/createpost');
  };

  const myPosts = () => {
    navigate('/myposts');
  };


  const renderButtons = () => {
    if (token !== null) {
      return (
        <div>
          <button className='navbarButton' role='myPostsButton' onClick={myPosts}>My posts</button>
          <button className='navbarButton' role='postsButton' onClick={posts}>Posts</button>
          <button className='navbarButton' role='createPostButton' onClick={createPost}>Create post</button>
          <button className='navbarButton' role='logoutButton' onClick={logout}>Logout</button>
        </div>
      );
    } else {
      return (
        <div>
          {/* Commenting this out, not sure if we think we need it ? 
          we display signup/login buttons already on HomePage.jsx:25-28 -> */}
          {/* <button className='navbarButton' role='loginButton' onClick={login}>Login</button>
          <button className='navbarButton' role='signupButton' onClick={signup}>Signup</button> */}
        </div> 
      );
    }
  };

  return (
    <div>
      <nav>
        <div className='navbarBox'>
          {/* Change reaction of the <h1> based on login status */}
          {/* IF there is a valid token (logged in) navigate to '/posts' */}
          {/* ELSE (not logged in/first visit/pending signup) navigate to '/' instead */}
          {token ? (
            <Link to="/posts" className="navbarLogo" id='navbarLogo'>
              <img className="AcebookLogoImage" role="logoImg" alt="Acebook logo" src={logoImage}></img>
              <img className="AcebookLogoText" role="logoText" alt="Acebook logo text" src={logoText}></img>
            </Link>
          ) : (
            // navigate to '/' if no token
            <Link to="/" className="navbarLogo" id='navbarLogo'>
              <img className="AcebookLogoImage" role="logoImg" alt="Acebook logo" src={logoImage}></img>
              <img className="AcebookLogoText" role="logoText" alt="Acebook logo text" src={logoText}></img>
            </Link>
          )}
          <div className='navbarButtons'>
            {renderButtons()}
          </div>
        </div>
        <div className='signedInInfo'>
          {username !== null ? `Signed in as ${username}` : null}
        </div>
      </nav>
    </div>
  );
};

export default NavigationBar;