import { AttendanceRoom } from "../interface/IAttendanceRoom";
import { AttendanceBystudent } from "../interface/IAttendance";
import { LoginInterface } from "../interface/ILogin";
import { LoginResponseInterface } from "../interface/ILoginRespon";
import { AttendanceRoomResponse } from "../interface/IAttendanceRoomresponse";

// const apiURL = "http://localhost:8080";
const apiURL = "https://sut-online-attendance-system.onrender.com";
// const apiURL = "http://localhost:8080";

function getAuthToken() {
  return sessionStorage.getItem("access_token") || "";
}

function getAuthHeaders() {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
}

async function SignIn(login: LoginInterface): Promise<LoginResponseInterface> {
  const response = await fetch(`${apiURL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login),
  });

  if (!response.ok) {
    throw new Error("Failed to login.");
  }

  return response.json();
}

async function getSubjectsByTid({ teacher_id }: { teacher_id: string }) {
  try {
    const response = await fetch(`${apiURL}/teachers/${teacher_id}/subjects`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch subjects", error);
    throw error;
  }
}

async function getSubjectsByid({ subject_id }: { subject_id: string }) {
  try {
    const response = await fetch(`${apiURL}/subjects/${subject_id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch subject details", error);
    throw error;
  }
}

// Create Attendance Room
async function CreateAttendance(data: AttendanceRoom) {
  try {
    const response = await fetch(`${apiURL}/attendance`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const res = await response.json();

    if (response.ok) {
      return { status: true, message: res.message, data: res.data };
    } else {
      return { status: false, message: res.error };
    }
  } catch (error: any) {
    console.error("Error creating attendance:", error);
    return { status: false, message: error.message || "An error occurred" };
  }
}

// Create Attendance for a Student
async function CreateAttendanceByStudent(data: AttendanceBystudent) {
  try {
    const response = await fetch(`${apiURL}/attendance/student`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const res = await response.json();

    if (response.ok) {
      return { status: true, message: res.data };
    } else {
      return { status: false, message: res.message };
    }
  } catch (error) {
    console.error("Error creating attendance for student:", error);
    return { status: false, message: "An unexpected error occurred" };
  }
}

// Get Attendance Room by ID
async function GetAttendanceRoom(roomId: string) {
  try {
    const response = await fetch(`${apiURL}/attendance/room/${roomId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      return { status: true, data };
    } else {
      const error = await response.json();
      return {
        status: false,
        message: error.message || "Failed to fetch data",
      };
    }
  } catch (error) {
    console.error("Error fetching attendance room:", error);
    return { status: false, message: "An unexpected error occurred" };
  }
}

// Get Students by Attendance Room ID

// Get Attendance Room by Subject ID

async function GetStudentsByRoomId(
  roomId: string
): Promise<{
  status: boolean;
  data?: AttendanceRoomResponse;
  message?: string;
}> {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),   

  };

  try {
    const response = await fetch(
      `${apiURL}/attendance_rooms/${roomId}/students`,
      requestOptions
    );

    if (response.ok) {
      const data: AttendanceRoomResponse = await response.json();
      return { status: true, data };
    } else {
      const error = await response.json();
      return {
        status: false,
        message: error.message || "Failed to fetch data",
      };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { status: false, message: "An unexpected error occurred" };
  }
}
async function GetAttendanceRoomBySubjectID(subject_id: string) {
  const requestOptions = {
    method: "GET",
    headers: getAuthHeaders(),   
  };

  try {
    const response = await fetch(
      `${apiURL}/attendance/room/subject/${subject_id}`,
      requestOptions
    );

    if (response.ok) {
      const data = await response.json();
      return { status: true, data };
    } else {
      const error = await response.json();
      return {
        status: false,
        message: error.message || "Failed to fetch data",
      };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { status: false, message: "An unexpected error occurred" };
  }
}

export {
  SignIn,
  getSubjectsByTid,
  getSubjectsByid,
  CreateAttendance,
  CreateAttendanceByStudent,
  GetAttendanceRoom,
  GetStudentsByRoomId,
  GetAttendanceRoomBySubjectID,
};
