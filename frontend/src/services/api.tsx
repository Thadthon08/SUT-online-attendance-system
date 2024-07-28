import { LoginInterface } from "../interface/ILogin";
import { LoginResponseInterface } from "../interface/ILoginRespon";

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

export { SignIn, getSubjectsByTid };
