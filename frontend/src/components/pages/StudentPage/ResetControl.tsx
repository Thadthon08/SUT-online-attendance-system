import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const ResetControl = ({ resetPosition }: { resetPosition: () => void }) => {
  const map = useMap(); 
  useEffect(() => {
    const control = new L.Control({ position: "topright" });

    control.onAdd = () => {
      const div = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-custom"
      );
      div.innerHTML = "<button>Reset Position</button>";
      div.style.backgroundColor = "white";
      div.style.padding = "5px";
      div.style.cursor = "pointer";

      div.onclick = () => {
        resetPosition();
      };

      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map, resetPosition]);

  return null;
};

export default ResetControl;
