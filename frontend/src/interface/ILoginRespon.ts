export interface LoginResponseInterface {
  token: Token;
}

export interface Token {
  email: string;
  name: string;
  token: string;
}
