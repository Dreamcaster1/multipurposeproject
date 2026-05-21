import { useEffect, useState } from "react";
import "./conversion.css";

function Convertmain() {
  const [currencies, changecurrencies] = useState([]);
  const [pairinfo, changepair] = useState(null);
  const [sessioncurrget, sessionchange] = useState("");
  const [lastRefresh, setLastRefresh] = useState("");

  useEffect(() => {
    async function loadcurrencyinfo() {
      try {
        let fetchcurr = await fetch(
          "https://v6.exchangerate-api.com/v6/39655384f04dbe4478b4e6b2/codes"
        );

        let jsoncurr = await fetchcurr.json();

        let res = jsoncurr.supported_codes.map((item) => {
          return {
            code: item[0],
            name: item[1],
          };
        });

        changecurrencies(res);
      } catch (err) {
        console.log(err);
      }
    }

    loadcurrencyinfo();
  }, []);

  useEffect(() => {
    async function loadexchangeinfo() {
      if (!sessioncurrget) return;

      try {
        let fetchexchange = await fetch(
          `https://v6.exchangerate-api.com/v6/39655384f04dbe4478b4e6b2/latest/${sessioncurrget}`
        );

        let jsonexchange = await fetchexchange.json();
        changepair(jsonexchange.conversion_rates);
      } catch (err) {
        console.log(err);
      }
    }

    loadexchangeinfo();
  }, [sessioncurrget]);

  async function func1(e) {
    const selectedCurrency = e.target.value;

    if (!selectedCurrency) return;

    try {
      await fetch("multipurposeproject-yhxq.vercel.app/currencychoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currchosen: selectedCurrency }),
      });

      let sessioncurr = await fetch("multipurposeproject-yhxq.vercel.app/currencysend", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      sessionchange(await sessioncurr.json());
    } catch (err) {
      console.log(err);
    }
  }

  async function refreshrate() {
    if (!sessioncurrget) return;

    try {
      let fetchexchange = await fetch(
        `https://v6.exchangerate-api.com/v6/39655384f04dbe4478b4e6b2/latest/${sessioncurrget}`
      );

      let jsonexchange = await fetchexchange.json();
      changepair(jsonexchange.conversion_rates);

      let refreshtime = new Date().toLocaleString();
      setLastRefresh(refreshtime);

      await fetch("https://multipurposeproject-yhxq.vercel.app/getrefreshtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refreshlast: refreshtime }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div id="convert-page">
      <div id="convert-wrapper">
        <div className="convert-header">
          <p className="convert-eyebrow">Currency converter</p>
          <h1>Live exchange rates</h1>
          <p className="convert-subtitle">
            Choose a base currency and compare it against available global rates.
          </p>
        </div>

        <div className="convert-controls">
          <select onChange={func1} id="convert-select" value={sessioncurrget}>
            <option value="" hidden>
              Choose your currency
            </option>

            {currencies.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name} / {item.code}
              </option>
            ))}
          </select>

          <button id="convert-refresh-btn" onClick={refreshrate}>
            Refresh rates
          </button>
        </div>

        <div className="convert-meta">
          <span>Base currency: {sessioncurrget || "Not selected"}</span>
          <span>{lastRefresh ? `Updated: ${lastRefresh}` : "Waiting for refresh"}</span>
        </div>

        <div id="convert-results">
          {pairinfo ? (
            Object.entries(pairinfo).map(([currency, rate]) => {
              return (
                <div className="convert-rate" key={currency}>
                  <span className="rate-code">{currency}</span>
                  <span className="rate-value">{rate}</span>
                </div>
              );
            })
          ) : (
            <div className="convert-empty">
              Pick a currency to load exchange rates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Convertmain;