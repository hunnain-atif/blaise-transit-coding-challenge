import React from "react";
import "./App.css";
import { REACT_APP_MAPBOX_TOKEN } from "./accessToken.js";
import ReactMapGL, { Popup, Marker } from "react-map-gl";
import passengers from "./passengers.json";
import stops from "./stops.json";
import { passengerMarker, stopMarker } from "./markers";
import * as geolib from "geolib";
import PolyLineOverlay from "./polyLineOverlay.js";

function App() {
  const [isShown, setIsShown] = React.useState(false);

  const [viewport, setViewport] = React.useState({
    latitude: 45.513,
    longitude: -73.573,
    width: "100vw",
    height: "100vh",
    zoom: 15,
  });

  const [hoveredStop, setHoveredStop] = React.useState(null);

  function hoverIsShown(stop) {
    setHoveredStop(stop);
    setIsShown(true);
  }

  function numOfClosestPassengers(stop) {
    let numOfPassengers = 0;
    for (let passenger of passengers) {
      const closestStop = geolib.findNearest(passenger, stops);
      if (closestStop === stop) {
        numOfPassengers++;
      }
    }
    return numOfPassengers;
  }

  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        {passengers.map((passenger) => (
          <div>
            <Marker
              latitude={passenger.lat}
              longitude={passenger.lon}
              offsetLeft={-7.25}
              offsetTop={-7.25}
            >
              {passengerMarker}
            </Marker>
            <PolyLineOverlay
              points={[
                [passenger.lon, passenger.lat],
                [
                  geolib.findNearest(passenger, stops).lon,
                  geolib.findNearest(passenger, stops).lat,
                ],
              ]}
            ></PolyLineOverlay>
          </div>
        ))}

        {stops.map((stop) => (
          <div
            onMouseEnter={() => hoverIsShown(stop)}
            onMouseLeave={() => setIsShown(false)}
          >
            <Marker
              latitude={stop.lat}
              longitude={stop.lon}
              offsetLeft={-7.25}
              offsetTop={-7.25}
            >
              {stopMarker}
            </Marker>
          </div>
        ))}

        {isShown && (
          <div>
            <Popup latitude={hoveredStop.lat} longitude={hoveredStop.lon}>
              <div>
                Number of Passengers Closest Who are Closest:{" "}
                {numOfClosestPassengers(hoveredStop)}
              </div>
            </Popup>
          </div>
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
