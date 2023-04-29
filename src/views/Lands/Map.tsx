import React, { useState, useRef, useCallback, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import useSupercluster from "../../@core/hooks/use-supercluster";
import PlacesAutoComplete from "./PlacesAutoComplete";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { config } from "../../configs";

const Marker = ({ children }) => children;

const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: 11,
};

export default function GoogleMap({ requireFilter = false }) {
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [points, setPoints] = useState([]);
  const [panPosition, setPanPosition] = useState(defaultProps.center);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  //   const loadAllPoints = useCallback(async () => {
  //     try {
  //       const points = [
  //         ...dataDefault,
  //         ...generate10KData(),
  //         ...generate10KData(0.5),
  //         ...generate10KData(1.2),
  //         ...generate10KData(1.5),
  //         ...generate10KData(1.7),
  //         ...generate10KData(2.0),
  //         ...generate10KData(2.2),
  //         ...generate10KData(2.5),
  //         ...generate10KData(3),
  //       ].map(([name, lat, lng]) => ({
  //         type: "Feature",
  //         properties: { cluster: false, crimeId: lat, category: lng },
  //         geometry: {
  //           type: "Point",
  //           coordinates: [parseFloat(lng), parseFloat(lat)],
  //         },
  //       }));
  //       setPoints(points);
  //     } catch (err) {
  //       console.log("err is ", err);
  //     }
  //   }, []);

  return (
    <div>
      <div style={{ height: "70vh" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: config.apiKey }}
          center={panPosition}
          defaultZoom={defaultProps.zoom}
        >
          {clusters.map((cluster, i) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } =
              cluster.properties;

            if (isCluster) {
              return (
                <Marker
                  key={`cluster-${cluster.id}-${i}`}
                  lat={latitude}
                  lng={longitude}
                >
                  <div
                    className="cluster-marker"
                    style={{
                      width: `${10 + (pointCount / points.length) * 20}px`,
                      height: `${10 + (pointCount / points.length) * 20}px`,
                    }}
                    onClick={() => {
                      const expansionZoom = Math.min(
                        supercluster.getClusterExpansionZoom(cluster.id),
                        20
                      );
                      mapRef.current.setZoom(expansionZoom);
                      mapRef.current.panTo({ lat: latitude, lng: longitude });
                    }}
                  >
                    {pointCount}
                  </div>
                </Marker>
              );
            }

            return (
              <Marker
                key={`crime-${cluster.properties.crimeId}`}
                lat={latitude}
                lng={longitude}
              >
                <button className="crime-marker">
                  <AddLocationIcon />
                </button>
              </Marker>
            );
          })}
        </GoogleMapReact>
      </div>

      <PlacesAutoComplete setPanPosition={setPanPosition} />
    </div>
  );
}
