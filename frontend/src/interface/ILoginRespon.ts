export interface LoginResponseInterface {
  token: TokenResponse; 
  user: UserResponse; 
}

export interface TokenResponse {
  access_token: string; 
  token_type: string; 
  expires_in: number; 
}

export interface UserResponse {
  email: string;
  firstname: string;
  teacher_id: string;
  lastname: string;
  phone_number: string;
  profile_pic: string;
}
