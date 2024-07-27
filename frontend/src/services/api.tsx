import { LoginInterface } from "../interface/ILogin";
import { UserInterface } from "../interface/IUser";
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

export { SignIn };
