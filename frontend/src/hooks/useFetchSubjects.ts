// hooks/useFetchSubjects.ts
import { useState, useEffect } from "react";
import { getSubjectsByid } from "../services/api";
import { Subject } from "../interface/ITeacherSubject";

const useFetchSubjects = (subject_id: string) => {
  const [subjects, setSubjects] = useState<Subject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjectsByid({ subject_id });
        setSubjects(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (subject_id) {
      fetchSubjects();
    }
  }, [subject_id]);

  return { subjects, error };
};

export default useFetchSubjects;
