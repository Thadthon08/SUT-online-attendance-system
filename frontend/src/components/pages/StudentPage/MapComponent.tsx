import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import ResetControl from "./ResetControl";
import userIconUrl from "../../../assets/userIcon.png";

const userIcon = new L.Icon({
  iconUrl: userIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const houseIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/69/69524.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface MapComponentProps {
  locationLat: number;
  locationLon: number;
  attendanceRoom: {
    location_lat: number;
    location_lon: number;
  } | null;
  resetPosition: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  locationLat,
  locationLon,
  attendanceRoom,
  resetPosition,
}) => {
  return (
    <MapContainer
      center={[locationLat, locationLon]}
      zoom={15}
      style={{ height: "150px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[locationLat, locationLon]} icon={userIcon}>
        <Popup>Your location</Popup>
      </Marker>
      {attendanceRoom && (
        <Marker
          position={[attendanceRoom.location_lat, attendanceRoom.location_lon]}
          icon={houseIcon}
        >
          <Popup>Attendance Room</Popup>
        </Marker>
      )}
      <ResetControl resetPosition={resetPosition} />
    </MapContainer>
  );
};

export default MapComponent;
