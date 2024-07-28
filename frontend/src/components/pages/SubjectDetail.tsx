import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Grid,
  GridItem,
  Heading,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Subject } from "../../interface/ITeacherSubject";
import { getSubjectsByid } from "../../services/api";


const SubjectDetail: React.FC = () => {
  const { subject_id = '' } = useParams<{ subject_id: string | undefined }>();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [subjects, setSubjects] = useState<Subject>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjectsByid({ subject_id: subject_id  });
        setSubjects(data);
        console.log(subjects)
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [subject_id]);


  return (
    <Box p={4} bg="gray.50" minHeight="100vh">
      <Stack spacing={8}>
        <Box 
          borderRadius="md" 
          boxShadow="md"       
          bgImage="url('https://img2.pic.in.th/pic/content.jpg')"
          bgPosition="bottom center "
          bgRepeat="no-repeat"
          bgSize="cover"
          >
          <Heading as="h1" size="lg" mb={4} color="#4F1787">
          {subject_id} {subjects?.subject_name}
          </Heading>
          <Text fontSize="lg" mb={2}>
            Subject ID: {subject_id}
          </Text>
          <Text fontSize="lg" mb={2}>
            Instructor: Dr. John Doe
          </Text>
          <Text fontSize="lg" mb={2}>
            Email: john.doe@example.com
          </Text>
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <GridItem
            w="100%"
            h="250px"
            bg="blue.500"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "blue.600", cursor: "pointer" }}
            boxShadow="md"
            onClick={() => navigate(`/create-room/${subject_id}`)}
          >
            <Text
              fontSize="2xl"
              color="white"
              fontWeight="bold"
              textAlign="center"
            >
              Create Attendance Room
            </Text>
          </GridItem>
          <GridItem
            w="100%"
            h="250px"
            bg="blue.500"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "blue.600", cursor: "pointer" }}
            boxShadow="md"
            onClick={() => navigate(`/room-history/${subject_id}`)}
          >
            <Text
              fontSize="2xl"
              color="white"
              fontWeight="bold"
              textAlign="center"
            >
              View Attendance History
            </Text>
          </GridItem>
        </Grid>
      </Stack>
    </Box>
  );
};

export default SubjectDetail;
