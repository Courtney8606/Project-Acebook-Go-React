import { Link, useNavigate } from "react-router-dom";
import "./NavigationBar.css";

// NavigationBar will render at the top of the page. The <nav>
// tag identifies it as the navigation information for the site
const NavigationBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Set functions for the different buttons on the navbar
  const logout = () => {
    // Removes the stored login ifno from browser's localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('userID')
    localStorage.removeItem('username')
    navigate("/login");
  };

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
          <button className='navbarButton' role='loginButton' onClick={login}>Login</button>
          <button className='navbarButton' role='signupButton' onClick={signup}>Signup</button>
        </div>
      );
    }
  };

  return (
    <div>
      <nav>
        <div className='navbarBox'>
          <Link to="/" className="navbarLogo" id='navbarLogo'>
            <h1>Acebook</h1>
          </Link>
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