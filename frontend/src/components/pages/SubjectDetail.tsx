import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Grid, Stack } from "@chakra-ui/react";
import { Subject } from "../../interface/ITeacherSubject";
import { getSubjectsByid } from "../../services/api";
import CarouselComponent from "../layout/Carousel";
import LoadingSkeleton from "../layout/LoadingSkeleton";
import SubjectHeader from "../layout/SubjectHeader";
import ActionGridItem from "../layout/ActionGridItem";
import { FaChalkboardTeacher, FaHistory } from "react-icons/fa";

const SubjectDetail: React.FC = () => {
  const { subject_id = "" } = useParams<{ subject_id: string | undefined }>();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjectsByid({ subject_id: subject_id });
        setSubjects(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [subject_id]);

  if (loading || error) {
    return (
      <>
        <CarouselComponent />
        <LoadingSkeleton />
      </>
    );
  }

  return (
    <>
      <CarouselComponent />
      <Box p={4} bg="gray.50" minHeight="100vh" className="no-copy-no-select">
        <Stack spacing={8}>
          <SubjectHeader subjects={subjects} subject_id={subject_id} />

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <ActionGridItem
              onClick={() => navigate(`/create-room/${subject_id}`)}
              text="Create Attendance Room"
              icon={<FaChalkboardTeacher size="3rem" color="white" />}
            />
            <ActionGridItem
              onClick={() => navigate(`/attendance/room/subject/${subject_id}`)}
              text="View Attendance History"
              icon={<FaHistory size="3rem" color="white" />}
            />
          </Grid>
        </Stack>
      </Box>
    </>
  );
};

export default SubjectDetail;
