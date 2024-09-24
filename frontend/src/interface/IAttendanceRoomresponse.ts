// interfaces.ts
export interface Student {
  first_name: string;
  last_name: string;
  location_lat: number;
  location_lon: number;
  student_id: string;
  creat_at: string;
}

export interface AttendanceRoomResponse {
  room_id: number;
  status: string;
  students: Student[];
}
