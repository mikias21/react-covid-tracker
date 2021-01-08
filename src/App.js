import { useState, useEffect } from "react";
import "./App.css";
import "leaflet/dist/leaflet.css";

// Material UI
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";

// Components
import InfoBox from "./Components/InfoBox";
import Map from "./Components/Map";
import Table from "./Components/Table";
import LineGraph from "./Components/LineGraph";

// Util
import { sortData, printNumber } from "./util";

function App() {
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState("worldwide");
  const [info, setInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseTypes, setCaseTypes] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const country = data.map((con) => ({
            name: con.country,
            value: con.countryInfo.iso2,
          }));
          setCountries(country);
          const sorted = sortData(data);
          setTableData(sorted);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}?strict=true`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelected(countryCode);
        setInfo(data);
        setMapCenter({
          lat: data.countryInfo.lat,
          lng: data.countryInfo.long,
        });
        setMapZoom(4);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={selected}
              onChange={(e) => onCountryChange(e)}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((c) => (
                <MenuItem value={c.value}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={caseTypes === "cases"}
            onClick={(e) => setCaseTypes("cases")}
            title="Coronavirus Cases"
            cases={printNumber(info?.todayCases)}
            total={printNumber(info?.case)}
          />
          <InfoBox
            active={caseTypes === "recovered"}
            onClick={(e) => setCaseTypes("recovered")}
            title="Recovered"
            cases={printNumber(info?.todayRecovered)}
            total={printNumber(info?.recovered)}
          />
          <InfoBox
            isRed
            active={caseTypes === "deaths"}
            onClick={(e) => setCaseTypes("deaths")}
            title="Deaths"
            cases={printNumber(info?.todayDeaths)}
            total={printNumber(info?.deaths)}
          />
        </div>

        <Map
          countries={mapCountries}
          caseType={caseTypes}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Word Wide {caseTypes}</h3>
          <LineGraph caseType={caseTypes} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
