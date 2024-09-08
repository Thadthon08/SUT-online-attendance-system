

export interface LoginResponseInterface {
  token: Token;
}

export interface Token {
  email: string;
  firstname: string;
  teacher_id: string;
  lastname: string;
  phone_number: string;
  profile_pic: string;
  token: string;
}
