import { Link } from "react-router-dom";
import "./home.css";

function Home({ sessionres }) {
  const features = [
    {
      title: "Weather",
      desc: "Check live weather data for any city and keep your latest location saved.",
      path: "/weather",
    },
    {
      title: "Currency",
      desc: "Compare exchange rates across global currencies with saved preferences.",
      path: "/currencyconvert",
    },
    {
      title: "Movies",
      desc: "Browse popular movies and build your own saved favourites list.",
      path: "/movies",
    },
    {
      title: "Crypto",
      desc: "Track major coins, market movement, charts, and crypto favourites.",
      path: "/crypto",
    },
    {
      title: "News",
      desc: "Pick interests and generate a personalised headline feed.",
      path: "/news",
    },
  ];

  return (
    <main className="home-page">
      <div className="home-bg-grid" aria-hidden="true"></div>

      <section className="home-hero">
        <div className="home-hero-content">
          <p className="home-eyebrow">InfoPortal</p>

          <h1>Your personal data dashboard.</h1>

          <p className="home-subtitle">
            Weather, currencies, movies, crypto, and news in one connected app.
            Save preferences, favourites, and build your own portal experience.
          </p>

          <div className="home-actions">
            {sessionres ? (
              <Link to="/weather" className="home-primary-btn">
                Open dashboard
              </Link>
            ) : (
              <>
                <Link to="/registration" className="home-primary-btn">
                  Create account
                </Link>

                <Link to="/login" className="home-secondary-btn">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="home-glass-panel">
          <div className="home-panel-top">
            <span className="home-status-dot"></span>
            <span>Portal modules</span>
          </div>

          <div className="home-mini-list">
            <div>
              <strong>5</strong>
              <span>Tools</span>
            </div>

            <div>
              <strong>{sessionres ? "On" : "Off"}</strong>
              <span>Session</span>
            </div>

            <div>
              <strong>Live</strong>
              <span>APIs</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="home-section-header">
          <h2>Choose a module</h2>
          <p>
            Each section uses the same saved-session system and the same dark
            glass theme.
          </p>
        </div>

        <div className="home-feature-grid">
          {features.map((feature) => (
            <Link to={feature.path} className="home-feature-card" key={feature.title}>
              <span>{feature.title}</span>
              <p>{feature.desc}</p>
              <strong>Open →</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;