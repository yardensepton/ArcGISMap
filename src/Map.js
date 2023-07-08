import React, { useEffect, useRef } from 'react';
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import esriConfig from "@arcgis/core/config";

esriConfig.apiKey = "AAPKfb39fcfaeffe41d48d12d976844ca4faQLLgKgFBHlSAK2RPLxxOxtHRHjCoHoa1aCWy0WrkUzlwHsdEXz7ifSaLmp81Q97N";

function MapComponent() {
  const mapElement = useRef(null);
  const view = useRef(null);
  const graphicsLayer = useRef(null);
  const parcelLayer = useRef(null);

  useEffect(() => {
    const map = new Map({
      basemap: "arcgis-navigation"
    });

    view.current = new MapView({
      container: mapElement.current,
      map: map,
      center: [35.217018, 31.771959],
      zoom: 6
    });

    graphicsLayer.current = new GraphicsLayer();
    map.add(graphicsLayer.current);

    parcelLayer.current = new FeatureLayer({
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Cities/FeatureServer/0",
    });

    function queryFeatureLayer(extent) {
      const parcelQuery = {
        where: "STATUS = 'National and provincial capital'",
        outFields: ["STATUS", "POP", "CITY_NAME"],
        returnGeometry: true
      };

      parcelLayer.current.queryFeatures(parcelQuery)
        .then((results) => {
          displayResults(results);
        })
        .catch((error) => {
          console.log(error.error);
        });
    }

    function displayResults(results) {
      const symbol = {
        type: "simple-marker",
        color: "#FF0000",
        size: "10px"
      };

      const popupTemplate = {
        title: "Info",
        content: "Name: {CITY_NAME} <br> Population: {POP}",
      };

      results.features.forEach((feature) => {
        feature.symbol = symbol;
        feature.popupTemplate = popupTemplate;
      });

      graphicsLayer.current.addMany(results.features);
    }

    view.current.when(() => {
      queryFeatureLayer(view.current.extent);
    });

  }, []);

  return <div style={{ height: 1100 }} ref={mapElement}></div>;
}

export default MapComponent;