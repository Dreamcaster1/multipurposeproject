import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./header.css";

const Header = ({ sessionres }) => {
  return (
    <header className="topnav" role="banner">
      <div className="topnav-inner">
        <Link to="/" className="topnav-brand">
          <span className="brand-mark"></span>
          <span>InfoPortal</span>
        </Link>

        <nav className="navlinks" role="navigation" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/weather"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            Weather
          </NavLink>

          <NavLink
            to="/currencyconvert"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            Currency
          </NavLink>

          <NavLink
            to="/movies"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            Movies
          </NavLink>

          <NavLink
            to="/crypto"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            Crypto
          </NavLink>

          <NavLink
            to="/news"
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            News
          </NavLink>
        </nav>

        <div className="authlinks">
          {sessionres ? (
            <span className="session-pill">
              <span></span>
              Logged in
            </span>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "authlink active" : "authlink"
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/registration"
                className={({ isActive }) =>
                  isActive ? "authlink primary active" : "authlink primary"
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;