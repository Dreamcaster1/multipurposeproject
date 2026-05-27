import { useEffect, useState } from "react";
import "./moviesstyle.css";
import bookmark from "../src/assets/bookmark.png";

function Movies() {
  const API_KEY_MOVIES = process.env.REACT_APP_API_KEY_MOVIES;

  const [allmovies, changeallmovies] = useState([]);
  const [fav, changefav] = useState([]);
  const [clicked, changeclicked] = useState("");
  const [bool, changebool] = useState(false);

  useEffect(() => {
    async function getmovies() {
      try {
        let movieslist = [];

        for (let i = 1; i <= 5; i++) {
          let fetchmov = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY_MOVIES}&language=en-US&page=${i}`
          );

          let jsonfetchmov = await fetchmov.json();

          let res = jsonfetchmov.results.map((item) => {
            return (
              <div className="movie-card" key={item.id} id={`movie-card-${item.id}`}>
                <img
                  className="movie-img"
                  id={`movie-img-${item.id}`}
                  src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                  alt={item.original_title}
                />

                <div className="movie-title-row" id={`movie-title-row-${item.id}`}>
                  <p className="movie-title" id={`movie-title-${item.id}`}>
                    {item.original_title}
                  </p>

                  <img
                    className="movie-bookmark"
                    onClick={(e) => favthemovie(e)}
                    id={`movie-bookmark-${item.id}`}
                    src={bookmark}
                    alt="bookmark"
                  />
                </div>

                <p className="movie-meta" id={`movie-pop-${item.id}`}>
                  Popularity: {item.popularity}
                </p>

                <p className="movie-meta" id={`movie-vote-${item.id}`}>
                  Rating: {item.vote_average}
                </p>

                <p className="movie-meta" id={`movie-date-${item.id}`}>
                  Released: {item.release_date}
                </p>
              </div>
            );
          });

          movieslist.push(res);
        }

        changeallmovies(movieslist);
      } catch (err) {
        console.log(err);
      }
    }

    getmovies();
  }, [API_KEY_MOVIES]);

  async function favthemovie(e) {
    let obj = {};
    let key = 0;

    const movieCard = e.target.parentNode.parentNode;

    Array.of(movieCard.children).forEach((i) => {
      for (const element of i) {
        if (element.src) {
          obj["img"] = element.src;
        } else {
          obj[key++] = element.textContent;
        }
      }
    });

    try {
      await fetch("https://multipurposeproject.onrender.com/addfavmovie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ allfavmoviedata: obj }),
      });

      let sessionget = await fetch("https://multipurposeproject.onrender.com/receivefavmovie", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      let jsonsessionget = await sessionget.json();

      let result = jsonsessionget.map((item, index) => {
        return (
          <div className="movie-card fav-card" id="movie-card-fav" key={index}>
            <img
              className="movie-img"
              id="movie-img-fav"
              src={`${item.img}`}
              alt="favourite movie"
            />

            <div className="movie-title-row" id="movie-title-row-fav">
              <p className="movie-title">{item[0]}</p>

              <img
                className="movie-bookmark active"
                onClick={(e) => unfavthemovie(e)}
                src={bookmark}
                alt="bookmark"
              />
            </div>

            <p className="movie-meta" id="movie-pop-fav">
              {item[1]}
            </p>

            <p className="movie-meta" id="movie-vote-fav">
              {item[2]}
            </p>

            <p className="movie-meta" id="movie-date-fav">
              {item[3]}
            </p>
          </div>
        );
      });

      changefav(result);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function setvariable() {
      try {
        await fetch("https://multipurposeproject.onrender.com/zerothevalues", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
      } catch (err) {
        console.log(err);
      }
    }

    async function getdataback() {
      try {
        let sessionget = await fetch("https://multipurposeproject.onrender.com/receivefavmovie", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        let jsonsessionget = await sessionget.json();

        if (jsonsessionget) {
          let result = jsonsessionget.map((item, index) => {
            return (
              <div className="movie-card fav-card" id="movie-card-fav" key={index}>
                <img
                  className="movie-img"
                  id="movie-img-fav"
                  src={`${item.img}`}
                  alt="favourite movie"
                />

                <div className="movie-title-row" id="movie-title-row-fav">
                  <p className="movie-title">{item[0]}</p>

                  <img
                    className="movie-bookmark active"
                    onClick={(e) => unfavthemovie(e)}
                    src={bookmark}
                    alt="bookmark"
                  />
                </div>

                <p className="movie-meta" id="movie-pop-fav">
                  {item[1]}
                </p>

                <p className="movie-meta" id="movie-vote-fav">
                  {item[2]}
                </p>

                <p className="movie-meta" id="movie-date-fav">
                  {item[3]}
                </p>
              </div>
            );
          });

          changefav(result);
        }
      } catch (err) {
        console.log(err);
      }
    }

    setvariable();
    getdataback();
  }, []);

  async function unfavthemovie(e) {
    const movieTitle = e.target.parentNode.firstChild.textContent;

    changebool((prev) => !prev);
    changeclicked(movieTitle);

    try {
      await fetch("https://multipurposeproject.onrender.com/removefavmovie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ clickedtounfav: movieTitle }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function removemovie() {
      if (fav) {
        let res = fav.filter((item) => {
          return item.props.children[1].props.children[0].props.children !== clicked;
        });

        changefav(res);
      }
    }

    removemovie();
  }, [bool]);

  return (
    <>
      <div className="page">
        <div className="page-bg" aria-hidden="true"></div>

        <header className="page-header">
          <div className="page-header-inner">
            <div className="brand">
              <div className="brand-dot" />

              <div className="brand-text">
                <h1 className="brand-title">Movie Vault</h1>
                <p className="brand-subtitle">
                  Popular picks + your saved favourites
                </p>
              </div>
            </div>

            <div className="page-hint">
              <span className="pill">Tip</span>
              <p>Scroll sideways. Tap the bookmark to save/remove.</p>
            </div>
          </div>
        </header>

        <div id="movies-shell">
          <div id="movies-header">
            <div className="section-bar">
              <p id="movies-title">Popular Movies</p>

              <div className="section-tools">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          </div>

          <div id="movies-row">{allmovies}</div>

          <div id="fav-shell">
            <div id="fav-header">
              <div className="section-bar">
                <p id="fav-title">Favourites</p>

                <div className="section-tools">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>

            <div id="fav-row">{fav}</div>
          </div>
        </div>

        <footer className="page-footer">
          <p>Data from TMDB • Built locally</p>
        </footer>
      </div>
    </>
  );
}

export default Movies;