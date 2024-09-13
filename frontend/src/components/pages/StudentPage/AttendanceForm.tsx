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
    <form onSubmit={onSubmit} className="mt-8">
      <div className="mb-4">
        <label htmlFor="student_id" className="block text-lg font-medium mb-2">
          Student ID
        </label>
        <input
          id="student_id"
          type="text"
          value={studentId}
          onChange={onStudentIdChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="firstname" className="block text-lg font-medium mb-2">
          First Name
        </label>
        <input
          id="firstname"
          type="text"
          value={firstname}
          onChange={onFirstnameChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="lastname" className="block text-lg font-medium mb-2">
          Last Name
        </label>
        <input
          id="lastname"
          type="text"
          value={lastname}
          onChange={onLastnameChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default AttendanceForm;
