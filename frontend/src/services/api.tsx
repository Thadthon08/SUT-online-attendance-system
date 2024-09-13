import { AttendanceRoom } from "../interface/IAttendanceRoom";
import { AttendanceBystudent } from "../interface/IAttendance";
import { LoginInterface } from "../interface/ILogin";
import { LoginResponseInterface } from "../interface/ILoginRespon";

// const apiURL = "https://sut-online-attendance-system.onrender.com";
const apiURL = "http://localhost:8080";

async function SignIn(login: LoginInterface): Promise<LoginResponseInterface> {
  const response = await fetch(`${apiURL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login),
  });

  const data = await response.json();

  return data;
}

async function getSubjectsByTid({ teacher_id }: { teacher_id: string }) {
  try {
    const response = await fetch(`${apiURL}/teachers/${teacher_id}/subjects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch subjects", error);
    throw error;
  }
}
async function getSubjectsByid({ subject_id }: { subject_id: string }) {
  try {
    const response = await fetch(`${apiURL}/subjects/${subject_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch subjects", error);
    throw error;
  }
}
async function CreateAttendance(data: AttendanceRoom) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiURL}/attendance`, requestOptions);
    const res = await response.json();

    if (res.status === "success") {
      return { status: true, message: res.message, data: res.data };
    } else {
      return { status: false, message: res.error };
    }
  } catch (error: any) {
    return { status: false, message: error.message || "An error occurred" };
  }
}
async function CreateAttendanceByStudent(data: AttendanceBystudent) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(
      `${apiURL}/attendance/student`,
      requestOptions
    );
    const res = await response.json();

    if (response.ok) {
      return { status: true, message: res.data };
    } else {
      return { status: false, message: res.message };
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return { status: false, message: "An unexpected error occurred" };
  }
}
//GetAttendanceRoom
async function GetAttendanceRoom(roomId: string) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(
      `${apiURL}/attendance/room/${roomId}`,
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
};
