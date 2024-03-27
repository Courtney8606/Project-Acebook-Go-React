import { Link } from 'react-router-dom';

import "./NavigationBar.css";

// NavigationBar will render at the top of the page. The <nav>
// tag identifies it as the navigation information for the site
const NavigationBar = () => {
  return (
    <header>
      <nav>
        ACEBOOK <Link to="/login">Login</Link>  <Link to="/signup">Signup</Link>
        <div className="line"></div>
      </nav>
    </header>
  );
};

export default NavigationBar;