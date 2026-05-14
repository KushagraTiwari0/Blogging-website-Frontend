import React, { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import {
  AuthRoute,
  GuestRoute,
  Navbar,
} from "./components";
import {
  Article,
  Auth,
  Editor,
  Home,
  Settings,
  Profile,
  PrivacyPolicy,
  TermsOfService,
} from "./pages";
import axios from "axios";

function App() {
  function setAuthorizationToken() {
    const jwt =
      window.localStorage.getItem("jwtToken");

    if (!jwt) {
      axios.defaults.headers.Authorization = ""; // Clear Authorization header if jwtToken is not present
      return;
    }

    const parsedJwt = JSON.parse(atob(jwt));
    axios.defaults.headers.Authorization = `Token ${parsedJwt.token}`;
  }

  useEffect(() => {
    setAuthorizationToken();
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div>
        <header>
          <Navbar />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/register"
              element={<GuestRoute />}
            >
              <Route
                path="/register"
                element={<Auth key="register" />}
              />
            </Route>
            <Route
              path="/login"
              element={<GuestRoute />}
            >
              <Route
                path="/login"
                element={<Auth key="login" />}
              />
            </Route>
            <Route
              path="/settings"
              element={<AuthRoute />}
            >
              <Route
                path="/settings"
                element={<Settings />}
              />
            </Route>
            <Route
              path="/editor"
              element={<AuthRoute />}
            >
              <Route
                path="/editor"
                element={<Editor />}
              />
            </Route>
            <Route
              path="/editor/:slug"
              element={<AuthRoute />}
            >
              <Route
                path="/editor/:slug"
                element={<Editor />}
              />
            </Route>
            <Route
              path="/article/:slug"
              element={<Article />}
            />
            <Route
              path="/profile/:slug"
              element={<Profile />}
            />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
          </Routes>
        </main>
        <footer style={{ textAlign: "center", padding: "20px", marginTop: "20px", borderTop: "1px solid #eaeaea" }}>
          <p>
            <Link to="/privacy" style={{ marginRight: "15px", color: "inherit", textDecoration: "none" }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</Link>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
