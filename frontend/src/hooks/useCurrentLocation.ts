// hooks/useCurrentLocation.ts
import { useState, useEffect } from "react";

const useCurrentLocation = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError(
          "ไม่สามารถดึงตำแหน่งที่ตั้งได้. กรุณาลองอีกครั้งหรือตรวจสอบการตั้งค่าการเข้าถึงตำแหน่งในเบราว์เซอร์ของคุณ."
        );
      }
    );
  }, []);

  return { location, error };
};

export default useCurrentLocation;
