import { TeacherData } from "./ITeacher";

export interface LoginResponseInterface {
  token: string;
  teacherData: TeacherData;
}
