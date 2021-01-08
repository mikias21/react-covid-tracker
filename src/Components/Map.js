import React from "react";
// import { Map as LeafletMap, TileLayer } from "react-leaflet";

import { MapContainer, TileLayer } from "react-leaflet";

import { showMapData } from "../util";

// css
import "../Styles/Map.css";

function Map({ countries, caseType, center, zoom }) {
  return (
    <div className="map">
      <MapContainer center={center} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showMapData(countries, caseType)}
      </MapContainer>
    </div>
  );
}

export default Map;
