import React, { useState, useRef, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import MapDrawShapeManager from "google-maps-draw-shape-lib";
import { config } from "../../../configs";
import PlacesAutocomplete from "./PlacesAutoComplete";

export default function MapDrawShape(props) {
  const [state, setState] = useState({
    mapLoaded: false,
    drawingMode: false,
    drawFreeHandMode: false,
    shape: [],
  });

  const [panPosition, setPanPosition] = useState(props.defaultCenter);

  const mapDrawShapeManagerRef = useRef(null);

  function onGoogleApiLoaded(map, maps) {
    mapDrawShapeManagerRef.current = new MapDrawShapeManager(
      map,
      onDrawCallback,
      state.drawingMode,
      state.drawFreeHandMode,
      props.polygonOptions,
      props.initialPointInnerHtml,
      props.deletePointInnerHtml
    );

    setState((prevState) => ({ ...prevState, mapLoaded: true }));
  }

  function onDrawCallback(shape) {
    props?.onDrawShape(shape);
    setState((prevState) => ({ ...prevState, shape, drawingMode: false }));
  }

  function setDrawingMode(drawingMode) {
    mapDrawShapeManagerRef.current.setDrawingMode(drawingMode);

    setState((prevState) => ({ ...prevState, drawingMode }));
  }

  function setDrawFreeHandMode(drawFreeHandMode) {
    mapDrawShapeManagerRef.current.setDrawFreeHandMode(drawFreeHandMode);

    setState((prevState) => ({ ...prevState, drawFreeHandMode }));
  }

  function initDrawnShape() {
    const initalShape = props.shape || [
      {
        lat: 38.71755745031312,
        lng: -9.34395756832437,
      },
      {
        lat: 39.780999209652855,
        lng: -8.82210698238687,
      },
      {
        lat: 38.91016617157451,
        lng: -6.82259526363687,
      },
      {
        lat: 38.71755745031312,
        lng: -9.34395756832437,
      },
    ];

    // console.log("initalShape ", initalShape);
    mapDrawShapeManagerRef.current.initDrawnShape(initalShape);

    setState((prevState) => ({ ...prevState, shape: initalShape }));
  }

  function resetDrawnShape() {
    mapDrawShapeManagerRef.current.resetDrawnShape();

    setState((prevState) => ({ ...prevState, shape: [] }));
  }

  useEffect(() => {
    if (!props.shape || !mapDrawShapeManagerRef.current) return;
    initDrawnShape();
  }, [props.shape, mapDrawShapeManagerRef.current]);

  return (
    <>
      <div className="map-container" style={{ height: "60vh" }}>
        <GoogleMapReact
          bootstrapURLKeys={props.mapBootstrap}
          options={props.mapOptions}
          center={panPosition}
          defaultZoom={props.defaultZoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => onGoogleApiLoaded(map, maps)}
        ></GoogleMapReact>

        {state.mapLoaded && !props.disabled && (
          <div className="controls-container">
            <div className="center">
              <button
                className="btn-control"
                onClick={() => setDrawingMode(!state.drawingMode)}
              >
                {!state.drawingMode ? "Start Draw" : "Cancel Draw"}
              </button>
              <button
                className="btn-control"
                disabled={state.drawingMode}
                onClick={() => setDrawFreeHandMode(!state.drawFreeHandMode)}
              >
                {!state.drawFreeHandMode ? "Set Drag Mode" : "Set Click Mode"}
              </button>
              <button
                className="btn-control"
                disabled={state.shape?.length > 0 || state.drawingMode}
                onClick={initDrawnShape}
              >
                Set Initial Shape
              </button>
              <button
                className="btn-control"
                disabled={!(state.shape?.length > 0) || state.drawingMode}
                onClick={resetDrawnShape}
              >
                Clear Shape
              </button>
            </div>
          </div>
        )}
      </div>
      <PlacesAutocomplete setPanPosition={setPanPosition} />
    </>
  );
}

MapDrawShape.defaultProps = {
  mapBootstrap: {
    key: config.apiKey, // Set your google maps api key here
    libraries: ["drawing", "places"],
  },
  mapOptions: {
    mapTypeId: "roadmap",
    minZoom: 5,
    maxZoom: 20,
    gestureHandling: "greedy",
    disableDefaultUI: true,
    scrollwheel: true,
    clickableIcons: false,
    rotateControl: false,
    tilt: 0,
  },
  defaultCenter: {
    lat: 33.626057,
    lng: 73.07144,
  },
  defaultZoom: 10,
  polygonOptions: {
    clickable: false,
    fillColor: "#303030",
    fillOpacity: 0.1,
    strokeColor: "#000000",
    strokeWeight: 4,
    strokeOpacity: 1,
  },
  initialPointInnerHtml: `<button class="btn-initial-point" title="Initial Point"></button>`,
  deletePointInnerHtml: `<button class="btn-delete-point" title="Delete">X</button></div>`,
  onDrawShape: () => {},
  shape: [],
  disabled: false,
};
