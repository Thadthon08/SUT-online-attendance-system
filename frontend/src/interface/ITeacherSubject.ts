// src/interfaces.ts

export interface Teacher {
  teacher_id: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  email: string;
  profile_pic: string;
  subjects: Subject[] | null;
}

export interface Subject {
  subject_id: string;
  subject_pic: string;
  subject_name: string;
  teachers: Teacher[] | null;
}
