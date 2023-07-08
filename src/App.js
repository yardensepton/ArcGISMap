import React from 'react';
import MapComponent from './Map';

function App() {
  return (
    <div className="App">
      <link rel="stylesheet" href="https://js.arcgis.com/4.27/esri/themes/light/main.css"></link>
      <div id="viewDiv">
        <MapComponent />
        
      </div>
    </div>
  );
}
export default App;