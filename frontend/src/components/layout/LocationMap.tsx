import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const LocationMap = ({ center }: any) => {
  // Create a custom icon for the marker
  const customMarker = new L.Icon({
    iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
    shadowSize: [50, 64],
    shadowAnchor: [4, 62],
  });

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{
        height: "300px",
        width: "100%",
        maxWidth: "100%",
        borderRadius: "8px",
      }}
      className="map-container"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={center} icon={customMarker}>
        <Popup>
          ที่อยู่ปัจจุบันของคุณ <br /> (Latitude: {center[0]}, <br />
          Longitude: {center[1]})
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;
