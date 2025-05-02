import React, {
  useState,
  useEffect,
} from "react";
import { useAuth } from "../hooks";
import { NavLink } from "react-router-dom";
import "../Navbar.css"; // Make sure to import your CSS file

function Navbar() {
  const { isAuth, authUser } = useAuth();
  const [theme, setTheme] = useState("light");

  // Update the theme in the document body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "light" ? "dark" : "light",
    );
  };

  return (
    <nav
      className={`navbar navbar-light ${theme}`}
    >
      <div className="container">
        <NavLink
          activeClassName="active"
          className="navbar-brand"
          to="/"
          end
        >
          Blogging App
        </NavLink>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink
              activeClassName="active"
              className="navbar-brand"
              to="/"
              end
            >
              Home
            </NavLink>
          </li>

          {isAuth && (
            <>
              <li className="nav-item">
                <NavLink
                  activeClassName="active"
                  className="navbar-brand"
                  to="/editor"
                >
                  &nbsp; New Post
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  activeClassName="active"
                  className="navbar-brand"
                  to="/settings"
                >
                  &nbsp; Settings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  activeClassName="active"
                  className="navbar-brand"
                  to={`/profile/@${authUser?.username}`} // Adjusted to point to the profile page
                >
                  Hi {authUser?.username}
                </NavLink>
              </li>
            </>
          )}

          {!isAuth && (
            <>
              <li className="nav-item">
                <NavLink
                  activeClassName="active"
                  className="navbar-brand"
                  to="/register"
                >
                  Sign up
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  activeClassName="active"
                  className="navbar-brand"
                  to="/login"
                >
                  Sign in
                </NavLink>
              </li>
            </>
          )}

          {/* Theme Toggle Button */}
          <li className="nav-item">
            <button
              onClick={toggleTheme}
              className="btn btn-toggle-theme"
            >
              {theme === "light"
                ? "Dark Mode"
                : "Light Mode"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
