import { LoginInterface } from "../interface/ILogin";
import { UserInterface } from "../interface/IUser";

const apiURL = "http://localhost:8080";

async function SignIn(login: LoginInterface): Promise<UserInterface> {
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

export { SignIn };
