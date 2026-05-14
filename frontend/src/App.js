import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Registration from "./registration";
import Mainweatherpage from "./mainweatherpage";
import Login from "./login";
import Convertmain from "./convertmain";
import Movies from "./movies";
import Crypto from "./crypto";
import News from "./news";
import Newsview from "./newsview";
import Verification from "./verification";
import Forgot from "./forgot";
import ChangePasswordPage from "./changepasswordpage";
import NotValid from "./notvalid";
import Home from "./Home";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import "./components/header.css";

function App() {
  const [sessionres, changesessionres] = useState(null);

  async function checksession() {
    try {
      const response = await fetch("http://localhost:5000/checksession", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const responsebool = await response.json();
      changesessionres(responsebool);
    } catch (err) {
      console.log(err);
      changesessionres(false);
    }
  }

  useEffect(() => {
    checksession();
  }, []);

  function ProtectedRoute({ children, title, message }) {
    if (sessionres === false) {
      return (
        <div className="notloggedin">
          <div>
            <h1>{title}</h1>
            <p>{message}</p>

            <div className="home-actions">
              <Link to="/login" className="home-primary-btn">
                Login
              </Link>

              <Link to="/registration" className="home-secondary-btn">
                Create account
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }

  if (sessionres === null) {
    return (
      <div className="notloggedin">
        <div>
          <h1>Loading</h1>
          <p>Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header sessionres={sessionres} />

      <div className="app-with-topnav">
        <Routes>
          <Route path="/" element={<Home sessionres={sessionres} />} />

          <Route path="/registration" element={<Registration />} />

          <Route
            path="/login"
            element={<Login setSessionRes={changesessionres} />}
          />

          <Route path="/forgot" element={<Forgot />} />

          <Route
            path="/weather"
            element={
              <ProtectedRoute
                title="You are not logged in"
                message="Please log in to view the weather dashboard."
              >
                <Mainweatherpage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/currencyconvert"
            element={
              <ProtectedRoute
                title="You are not logged in"
                message="Please log in to view the currency converter."
              >
                <Convertmain />
              </ProtectedRoute>
            }
          />

          <Route
            path="/movies"
            element={
              <ProtectedRoute
                title="You are not logged in"
                message="Please log in to view the movie dashboard."
              >
                <Movies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/crypto"
            element={
              <ProtectedRoute
                title="You are not logged in"
                message="Please log in to view the crypto dashboard."
              >
                <Crypto />
              </ProtectedRoute>
            }
          />

          <Route
            path="/news"
            element={
              <ProtectedRoute
                title="You are not logged in"
                message="Please log in to view the news setup."
              >
                <News />
              </ProtectedRoute>
            }
          />

          <Route
            path="/newsview"
            element={
              <ProtectedRoute
                title="You are not logged in"
                message="Please log in to view your news feed."
              >
                <Newsview />
              </ProtectedRoute>
            }
          />

          <Route path="/verifiedemail" element={<Verification />} />
          <Route path="/resetpassword" element={<ChangePasswordPage />} />
          <Route path="/notvalid" element={<NotValid />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;