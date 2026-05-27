import { useEffect, useState } from "react";
import "./news.css";
import { useNavigate } from "react-router-dom";

function News() {
  const navigate = useNavigate();

  const interests = [
    "Business",
    "Entertainment",
    "General",
    "Health",
    "Science",
    "Sports",
    "Technology",
  ];

  const [selecteditems, changeselected] = useState([]);
  const [savebackres, changeback] = useState({ selectedtopics: [] });
  const [toast, setToast] = useState("");

  async function safeJson(response) {
    const text = await response.text();

    if (!text) {
      return null;
    }

    return JSON.parse(text);
  }

  async function clickinterests(item) {
    const filtered = selecteditems.includes(item)
      ? selecteditems.filter((i) => i !== item)
      : [...selecteditems, item];

    changeselected(filtered);
    changeback({ selectedtopics: filtered });

    try {
      await fetch("https://multipurposeproject.onrender.com/sessioninterests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ selectedtopics: filtered }),
      });
    } catch (err) {
      console.log(err);
      setToast("Could not save your interests.");
    }
  }

  useEffect(() => {
    async function getbackdata() {
      try {
        let fetchres = await fetch("https://multipurposeproject.onrender.com/sendinterests", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        let jsonres = await safeJson(fetchres);

        if (jsonres && Array.isArray(jsonres.selectedtopics)) {
          changeback(jsonres);
          changeselected(jsonres.selectedtopics);
        } else {
          changeback({ selectedtopics: [] });
          changeselected([]);
        }
      } catch (err) {
        console.log(err);
        changeback({ selectedtopics: [] });
        changeselected([]);
      }
    }

    getbackdata();
  }, []);

  function continuebtn() {
    const selectedTopics = savebackres?.selectedtopics || [];

    if (selectedTopics.length > 0) {
      navigate("/newsview");
    } else {
      setToast("Pick at least one topic first.");

      setTimeout(() => {
        setToast("");
      }, 2200);
    }
  }

  return (
    <div className="interest-page">
      <div className="interest-bg-grid" aria-hidden="true"></div>
      <div className="interest-bg-left" aria-hidden="true"></div>
      <div className="interest-bg-center" aria-hidden="true"></div>
      <div className="interest-bg-right" aria-hidden="true"></div>

      {toast && <div className="interest-toast">{toast}</div>}

      <div className="interest-container">
        <div className="interest-header">
          <p className="interest-eyebrow">News setup</p>
          <h1>Select Your Interests</h1>
          <p>Choose topics you want to see in your feed.</p>
        </div>

        <div className="interest-grid">
          {interests.map((interest) => {
            const active = selecteditems.includes(interest);

            return (
              <button
                key={interest}
                type="button"
                className={active ? "interest-card active" : "interest-card"}
                onClick={() => clickinterests(interest)}
              >
                <span>{interest}</span>
              </button>
            );
          })}
        </div>

        <div className="interest-actions">
          <p>
            {selecteditems.length === 0
              ? "No topics selected"
              : `${selecteditems.length} topic${
                  selecteditems.length === 1 ? "" : "s"
                } selected`}
          </p>

          <button onClick={continuebtn} className="interest-button">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default News;