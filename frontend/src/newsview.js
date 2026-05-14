import { useEffect, useState } from "react";
import "./newsview.css";

function Newsview() {
  const API_KEY_NEWS = process.env.REACT_APP_API_KEY_NEWS;

  const [apiresult, changeapires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedtopics, setSelectedtopics] = useState([]);

  async function safeJson(response) {
    const text = await response.text();

    if (!text) {
      return null;
    }

    return JSON.parse(text);
  }

  useEffect(() => {
    async function getnews() {
      try {
        setLoading(true);

        let backres = await fetch("http://localhost:5000/sendinterests", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        let selectedtopicsres = await safeJson(backres);

        const topics = Array.isArray(selectedtopicsres?.selectedtopics)
          ? selectedtopicsres.selectedtopics
          : [];

        setSelectedtopics(topics);

        if (topics.length === 0) {
          changeapires([]);
          setLoading(false);
          return;
        }

        let res = topics.map(async (item) => {
          let fetchapi = await fetch(
            `https://newsapi.org/v2/top-headlines?country=us&category=${item.toLowerCase()}&apiKey=${API_KEY_NEWS}`
          );

          let json = await safeJson(fetchapi);

          return json?.articles || [];
        });

        let apiresponse = await Promise.all(res);

        const flattenedArticles = apiresponse
          .flat()
          .filter((article) => article && article.title && article.url);

        changeapires(flattenedArticles);
      } catch (err) {
        console.log(err);
        changeapires([]);
      } finally {
        setLoading(false);
      }
    }

    getnews();
  }, [API_KEY_NEWS]);

  return (
    <div className="news-page">
      <div className="news-bg-grid" aria-hidden="true"></div>

      <header className="news-header">
        <div>
          <p className="news-eyebrow">Personal feed</p>
          <h1>Latest News</h1>
          <p>
            {selectedtopics.length > 0
              ? `Headlines based on: ${selectedtopics.join(", ")}`
              : "Your fetched headlines will appear here."}
          </p>
        </div>

        <div className="news-count-card">
          <span>Articles</span>
          <strong>{apiresult.length}</strong>
        </div>
      </header>

      {loading && (
        <div className="news-loading">
          <p>Loading your selected headlines...</p>
        </div>
      )}

      {!loading && (
        <div className="news-grid">
          {Array.isArray(apiresult) && apiresult.length > 0 ? (
            apiresult.map((item, index) => {
              return (
                <a
                  key={`${item.url}-${index}`}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="news-card"
                >
                  <div className="news-image-wrap">
                    <img
                      src={
                        item.urlToImage
                          ? item.urlToImage
                          : "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"
                      }
                      alt={item.title || "News image"}
                      className="news-image"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png";
                      }}
                    />
                  </div>

                  <div className="news-content">
                    <div className="news-topline">
                      <span className="news-source">
                        {item.source?.name ? item.source.name : "Unknown Source"}
                      </span>

                      <span className="news-date">
                        {item.publishedAt
                          ? new Date(item.publishedAt).toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>

                    <h2 className="news-title">{item.title}</h2>

                    <p className="news-description">
                      {item.description
                        ? item.description
                        : "No description available for this article."}
                    </p>

                    <div className="news-footer">
                      <span className="news-author">
                        {item.author ? item.author : "Unknown author"}
                      </span>

                      <span className="news-readmore">Read more →</span>
                    </div>
                  </div>
                </a>
              );
            })
          ) : (
            <div className="news-empty">
              <p>No news found.</p>
              <span>
                Choose at least one topic, or check the News API response.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Newsview;