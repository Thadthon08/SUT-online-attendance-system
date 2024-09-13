export interface AttendanceRoom {
  room_id?: number; // Updated to match the backend model
  subject_id: string;
  room_name: string;
  start_time: string;
  end_time: string;
  location_lat: number;
  location_lon: number;
}
