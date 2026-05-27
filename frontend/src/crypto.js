import { useEffect, useState } from "react";
import BaselineChartBTC from "./chartsbtc";
import "./crypto.css";
import bookmark from "../src/assets/bookmark.png";
import bookmark2 from "../src/assets/bookmark2.png";
import FavouritesPanel from "./cryptofavs";

function Crypto() {
  const [cryptodata, changecryptodata] = useState([]);
  const [sparkline, changesparkline] = useState([]);
  const [fetchress, changefetchres] = useState([]);
  const [loading, setLoading] = useState(true);

  const coins = [
    "bitcoin",
    "ethereum",
    "binancecoin",
    "ripple",
    "solana",
    "tron",
    "dogecoin",
    "monero",
  ];

  const chartPairs = [
    "BTCUSDT",
    "ETHUSDT",
    "BNBUSDT",
    "XRPUSDT",
    "SOLUSDT",
    "TRXUSDT",
    "DOGEUSDT",
    "XMRUSDT",
  ];

  function fmtMoney(n) {
    if (typeof n !== "number") return "—";

    return n.toLocaleString(undefined, {
      maximumFractionDigits: n < 1 ? 6 : 2,
    });
  }

  function fmtBigMoney(n) {
    if (typeof n !== "number") return "—";

    if (n >= 1_000_000_000) {
      return `${(n / 1_000_000_000).toFixed(2)}B`;
    }

    if (n >= 1_000_000) {
      return `${(n / 1_000_000).toFixed(2)}M`;
    }

    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  function fmtPct(n) {
    if (typeof n !== "number") return "—";
    return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
  }

  useEffect(() => {
    async function fetchcoins() {
      try {
        const fetched = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.join(
            ","
          )}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
        );

        const fetchedjson = await fetched.json();
        changecryptodata(Array.isArray(fetchedjson) ? fetchedjson : []);
      } catch (err) {
        console.log(err);
        changecryptodata([]);
      }
    }

    async function fetchgraph() {
      try {
        const response = chartPairs.map(async (item) => {
          const res = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${item}&interval=1h&limit=30`
          );

          return await res.json();
        });

        const allresult = await Promise.all(response);

        const res = allresult.map((item) => {
          if (!Array.isArray(item)) return [];

          return item.map((subitem) => {
            return subitem.filter((subsubitem, subsubindex) => {
              return subsubindex === 0 || subsubindex === 4;
            });
          });
        });

        changesparkline(res);
      } catch (err) {
        console.log(err);
        changesparkline([]);
      }
    }

    async function fetchsavedcoins() {
      try {
        const res2 = await fetch("https://multipurposeproject.onrender.com/sendtofrontend", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const res = await res2.json();
        changefetchres(Array.isArray(res) ? res : []);
      } catch (err) {
        console.log(err);
        changefetchres([]);
      }
    }

    async function loadAll() {
      setLoading(true);

      await Promise.all([fetchcoins(), fetchgraph(), fetchsavedcoins()]);

      setLoading(false);
    }

    loadAll();
  }, []);

  async function favourite(index) {
    try {
      const selectedcoin = cryptodata[index];

      if (!selectedcoin) return;

      const alreadyfavourited = fetchress.some(
        (item) => item.id === selectedcoin.id
      );

      const res = await fetch("https://multipurposeproject.onrender.com/savefromfrontend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          coin: selectedcoin,
          isFav: !alreadyfavourited,
        }),
      });

      const updatedcoins = await res.json();
      changefetchres(Array.isArray(updatedcoins) ? updatedcoins : []);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main className="cryptoPage">
      <div className="cryptoBg" aria-hidden="true"></div>

      <section className="cryptoHero">
        <div>
          <p className="cryptoEyebrow">Crypto dashboard</p>
          <h1>Market Watch</h1>
          <p className="cryptoSubtitle">
            Track major coins, live price movement, mini charts, and your saved
            favourites in one place.
          </p>
        </div>

        <div className="cryptoHeroCard">
          <span className="heroCardLabel">Tracked assets</span>
          <strong>{cryptodata.length || "—"}</strong>
          <span className="heroCardText">Popular market pairs</span>
        </div>
      </section>

      <section className="cryptoShell">
        <div className="cryptoShellHeader">
          <div>
            <h2>Live market</h2>
            <p>
              {loading
                ? "Loading coin data..."
                : `${cryptodata.length} assets loaded`}
            </p>
          </div>

          <div className="cryptoStatus">
            <span className="statusDot"></span>
            <span>Live API data</span>
          </div>
        </div>

        <div className="cryptoTable">
          <div className="coinTableHead">
            <span>Rank</span>
            <span>Asset</span>
            <span>Price</span>
            <span>24h</span>
            <span>Chart</span>
            <span>Market cap</span>
            <span>Volume</span>
            <span>Save</span>
          </div>

          {loading && (
            <div className="cryptoEmpty">
              Loading market data and sparklines...
            </div>
          )}

          {!loading &&
            cryptodata.length > 0 &&
            sparkline.length > 0 &&
            cryptodata.map((currentcoin, index) => {
              const isfav = fetchress.some(
                (favcoin) => favcoin.id === currentcoin.id
              );

              return (
                <div className="coinRow" key={currentcoin.id}>
                  <div className="coinCell coinRank">
                    <p className="coinMuted">#{currentcoin.market_cap_rank}</p>
                  </div>

                  <div className="coinCell coinIdentity">
                    <img
                      className="coinLogo"
                      src={currentcoin.image}
                      alt={currentcoin.name}
                    />

                    <div className="coinNameWrap">
                      <p className="coinName">{currentcoin.name}</p>
                      <p className="coinTicker">
                        {currentcoin.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="coinCell coinPrice">
                    <p className="coinValue">${fmtMoney(currentcoin.current_price)}</p>
                  </div>

                  <div
                    className={
                      "coinCell coinChange " +
                      (currentcoin.price_change_percentage_24h >= 0
                        ? "isUp"
                        : "isDown")
                    }
                  >
                    <p className="coinValue">
                      {fmtPct(currentcoin.price_change_percentage_24h)}
                    </p>
                  </div>

                  <div className="coinCell coinChart">
                    <div className="sparkWrap">
                      <BaselineChartBTC sparklinedata={sparkline[index]} />
                    </div>
                  </div>

                  <div className="coinCell coinMcap">
                    <p className="coinValue">
                      ${fmtBigMoney(currentcoin.market_cap)}
                    </p>
                  </div>

                  <div className="coinCell coinVol">
                    <p className="coinValue">
                      ${fmtBigMoney(currentcoin.total_volume)}
                    </p>
                  </div>

                  <div className="coinCell coinBookmark">
                    <button
                      className={isfav ? "bookmarkBtn isSaved" : "bookmarkBtn"}
                      onClick={() => favourite(index)}
                      aria-label={
                        isfav
                          ? `Remove ${currentcoin.name} from favourites`
                          : `Save ${currentcoin.name} to favourites`
                      }
                    >
                      <img
                        src={isfav ? bookmark2 : bookmark}
                        alt=""
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              );
            })}

          {!loading && cryptodata.length === 0 && (
            <div className="cryptoEmpty">
              No crypto data loaded. Check the API response or network.
            </div>
          )}
        </div>
      </section>

      <FavouritesPanel favs={fetchress} />
    </main>
  );
}

export default Crypto;