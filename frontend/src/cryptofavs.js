function FavouritesPanel({ favs }) {
  const safeFavs = Array.isArray(favs) ? favs : [];

  const fmtMoney = (n) =>
    typeof n === "number"
      ? n.toLocaleString(undefined, {
          maximumFractionDigits: n < 1 ? 6 : 2,
        })
      : "—";

  const fmtBigMoney = (n) => {
    if (typeof n !== "number") return "—";

    if (n >= 1_000_000_000) {
      return `${(n / 1_000_000_000).toFixed(2)}B`;
    }

    if (n >= 1_000_000) {
      return `${(n / 1_000_000).toFixed(2)}M`;
    }

    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const fmtPct = (n) =>
    typeof n === "number" ? `${n >= 0 ? "+" : ""}${n.toFixed(2)}%` : "—";

  if (!Array.isArray(favs)) {
    return (
      <section className="favsPanel">
        <div className="favsHeader">
          <div>
            <p className="favsEyebrow">Saved list</p>
            <h2 className="favsTitle">Favourites</h2>
          </div>

          <p className="favsSub">Click a bookmark to load your favourites.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="favsPanel">
      <div className="favsHeader">
        <div>
          <p className="favsEyebrow">Saved list</p>
          <h2 className="favsTitle">Favourites</h2>
        </div>

        <p className="favsSub">
          {safeFavs.length === 0
            ? "No favourites saved yet."
            : `${safeFavs.length} saved coin${
                safeFavs.length === 1 ? "" : "s"
              }`}
        </p>
      </div>

      {safeFavs.length === 0 && (
        <div className="favsEmpty">
          Save a coin from the market table and it will appear here.
        </div>
      )}

      {safeFavs.length > 0 && (
        <div className="favsGrid">
          {safeFavs.map((c) => (
            <article key={c.id} className="favCard">
              <div className="favTop">
                <div className="favId">
                  <img className="favLogo" src={c.image} alt={c.name} />

                  <div>
                    <div className="favName">{c.name}</div>
                    <div className="favTicker">
                      {String(c.symbol || "").toUpperCase()}
                    </div>
                  </div>
                </div>

                <div
                  className={
                    "favChange " +
                    (c.price_change_percentage_24h >= 0 ? "isUp" : "isDown")
                  }
                  title="24h change"
                >
                  {fmtPct(c.price_change_percentage_24h)}
                </div>
              </div>

              <div className="favMainValue">
                <span>Current price</span>
                <strong>${fmtMoney(c.current_price)}</strong>
              </div>

              <div className="favStats">
                <div className="favStat">
                  <div className="favLabel">Market cap</div>
                  <div className="favValue">${fmtBigMoney(c.market_cap)}</div>
                </div>

                <div className="favStat">
                  <div className="favLabel">Volume</div>
                  <div className="favValue">${fmtBigMoney(c.total_volume)}</div>
                </div>

                <div className="favStat">
                  <div className="favLabel">Rank</div>
                  <div className="favValue">#{c.market_cap_rank ?? "—"}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default FavouritesPanel;