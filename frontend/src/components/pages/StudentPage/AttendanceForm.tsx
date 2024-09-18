import React from "react";

interface AttendanceFormProps {
  studentId: string;
  firstname: string;
  lastname: string;
  onStudentIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFirstnameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastnameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  studentId,
  firstname,
  lastname,
  onStudentIdChange,
  onFirstnameChange,
  onLastnameChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="mt-5">
      <div className="mb-2">
        <input
          placeholder="รหัสนักศึกษา"
          id="student_id"
          type="text"
          value={studentId}
          onChange={onStudentIdChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <input
          placeholder="ชื่อ"
          id="firstname"
          type="text"
          value={firstname}
          onChange={onFirstnameChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-2">
        <input
          placeholder="นามสกุล"
          id="lastname"
          type="text"
          value={lastname}
          onChange={onLastnameChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <button type="submit" className="w-full py-2 bg-org text-white rounded ">
        Submit
      </button>
    </form>
  );
};

export default AttendanceForm;
