export interface AttendanceBystudent {
  room_id: number; // Ensure room_id is number here
  student_id: string;
  first_name: string;
  last_name: string;
  location_lat: number;
  location_lon: number;
}
