import { useEffect, useState } from "react";
import "./styles.css";
import { useLocation } from "react-router-dom";

function Mainweatherpage() {
  const location = useLocation();
  const API_KEY_WEATHER = process.env.REACT_APP_API_KEY_WEATHER;

  const [cityinput, changeinput] = useState("");
  const [dataafterclick, changedata] = useState(null);
  const [loadflag, changeflag] = useState(false);

  function function1(e) {
    changeinput(e.target.value);
  }

  useEffect(() => {
    async function weatherdatafromback() {
      try {
        let arrback = await fetch("multipurposeproject-yhxq.vercel.app/accesstosession", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        let temporary = await arrback.json();

        changedata(temporary.sessionback);
        changeflag(true);
      } catch (err) {
        console.log(err);
        changeflag(true);
      }
    }

    weatherdatafromback();
  }, [location.pathname]);

  async function apicall() {
    const trimmedCity = cityinput.trim();

    if (trimmedCity === "") {
      return;
    }

    const formattedCity =
      trimmedCity.charAt(0).toUpperCase() + trimmedCity.slice(1);

    try {
      let weatherdata = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${formattedCity}&appid=${API_KEY_WEATHER}&units=metric`
      );

      let updatedweather = await weatherdata.json();

      if (!weatherdata.ok) {
        console.log(updatedweather);
        return;
      }

      let alldata2 = {
        maindata: updatedweather.main,
        city: updatedweather.name,
        weathertype: updatedweather.weather[0],
      };

      let arrback = await fetch("multipurposeproject-yhxq.vercel.app/weathersession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ citysessionback: alldata2 }),
      });

      let temporary = await arrback.json();
      changedata(temporary);
    } catch (err) {
      console.log(err);
    }
  }

  if (loadflag === true) {
    return (
      <>
        <div className="controls">
          <input
            value={cityinput}
            onChange={function1}
            type="text"
            placeholder="Enter city (e.g. London)"
          />

          <button onClick={apicall}>Look at the weather</button>
        </div>

        <div>
          <div className="weather-main">
            <div className="city">
              <p className="label">My location</p>
              <p className="name">{dataafterclick?.city ?? "—"}</p>
            </div>

            <div className="temp">
              <div className="degrees">
                {dataafterclick?.maindata?.temp !== undefined
                  ? Math.round(dataafterclick.maindata.temp)
                  : "—"}
                °
              </div>

              <div className="type">
                {dataafterclick?.weathertype?.main ?? "—"}
              </div>
            </div>
          </div>

          <div className="stats" role="list" aria-label="Weather details">
            <div className="stat" role="listitem">
              <div className="val">
                {dataafterclick?.maindata?.temp_max !== undefined
                  ? Math.floor(dataafterclick.maindata.temp_max)
                  : "—"}
                °
              </div>
              <div className="k">High</div>
            </div>

            <div className="stat" role="listitem">
              <div className="val">
                {dataafterclick?.maindata?.temp_min !== undefined
                  ? Math.floor(dataafterclick.maindata.temp_min)
                  : "—"}
                °
              </div>
              <div className="k">Low</div>
            </div>

            <div className="stat" role="listitem">
              <div className="val">
                {dataafterclick?.maindata?.feels_like !== undefined
                  ? Math.floor(dataafterclick.maindata.feels_like)
                  : "—"}
                °
              </div>
              <div className="k">Feels like</div>
            </div>

            <div className="stat" role="listitem">
              <div className="val">
                {dataafterclick?.maindata?.humidity !== undefined
                  ? dataafterclick.maindata.humidity
                  : "—"}
                %
              </div>
              <div className="k">Humidity</div>
            </div>
          </div>

          <div className="weather-footer">
            <span>Data provided by your API</span>
            <span style={{ opacity: 0.85 }}>Updated just now</span>
          </div>
        </div>
      </>
    );
  }
}

export default Mainweatherpage;