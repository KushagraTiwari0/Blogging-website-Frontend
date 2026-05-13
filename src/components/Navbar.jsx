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

  // Add a subtle drop shadow to navbar when scrolled
  useEffect(() => {
    const handleScroll = () => {
      document.querySelector('.navbar')?.classList.toggle('scrolled', window.scrollY > 4);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup the event listener on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar">
      <div className="container">
        <NavLink className="navbar-brand" to="/" end>
          <img src="/Logo.jpg" alt="Logo" style={{ height: '40px', verticalAlign: 'middle' }} />
        </NavLink>

        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              to="/"
              end
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Home</span>
            </NavLink>
          </li>

          {isAuth && (
            <>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  to="/editor"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  <span>Write</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  to="/settings"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  <span>Settings</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  to={`/profile/@${authUser?.username}`}
                >
                  <img 
                    src={authUser?.image && authUser.image !== "https://api.realworld.io/images/smiley-cyrus.jpeg" ? authUser.image : `https://api.dicebear.com/9.x/thumbs/svg?seed=${authUser?.username}`} 
                    alt="avatar" 
                    className="nav-avatar" 
                  />
                  <span>{authUser?.username?.split(/[- ]/)[0]}</span>
                </NavLink>
              </li>
            </>
          )}

          {!isAuth && (
            <>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  to="/login"
                >
                  <span>Sign in</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link btn-signup"
                  to="/register"
                >
                  <span>Sign up</span>
                </NavLink>
              </li>
            </>
          )}

          {/* Theme Toggle Button */}
          <li className="nav-item theme-toggle-item">
            <button
              onClick={toggleTheme}
              className="btn-toggle-theme icon-btn"
              aria-label="Toggle Dark Mode"
            >
              <div className={`icon-wrapper ${theme}`}>
                {/* Sun icon */}
                <svg className="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                {/* Moon icon */}
                <svg className="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
