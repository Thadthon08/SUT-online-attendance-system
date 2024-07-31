import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Grid,
  GridItem,
  Heading,
  Stack,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { Subject } from "../../interface/ITeacherSubject";
import { getSubjectsByid } from "../../services/api";
import CarouselComponent from "../layout/Carousel";

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

  if (loading) {
    return (
      <>
        <CarouselComponent />
        <Box p={4} bg="gray.50" minHeight="100vh" className="no-copy-no-select">
          <Stack spacing={8}>
            <Skeleton height="40px" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" />
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={6}
            >
              <Skeleton height="250px" />
              <Skeleton height="250px" />
            </Grid>
          </Stack>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CarouselComponent />
        <Box p={4} bg="gray.50" minHeight="100vh" className="no-copy-no-select">
          <Stack spacing={8} textAlign="center">
            <Heading as="h1" size="lg" mb={4} color="red.500">
              Error
            </Heading>
            <Text fontSize="lg">{error}</Text>
          </Stack>
        </Box>
      </>
    );
  }

  return (
    <>
      <CarouselComponent />
      <Box p={4} bg="gray.50" minHeight="100vh" className="no-copy-no-select">
        <Stack spacing={8}>
          <Box position="relative" p={6} borderRadius="md" boxShadow="md">
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgImage="url('https://img2.pic.in.th/pic/content.jpg')"
              bgPosition="bottom center"
              bgRepeat="no-repeat"
              bgSize="cover"
              borderRadius="md"
              opacity={0.5}
              zIndex={1}
            />
            <Box position="relative" zIndex={2}>
              <Heading as="h1" size="lg" mb={4} color="#303841">
                {subject_id} {subjects?.subject_name}
              </Heading>
              <Text fontSize="lg" mb={2} fontWeight={"500"}>
                Subject Id: {subjects?.subject_id}
              </Text>
              <Text fontSize="lg" mb={2} fontWeight={"500"}>
                Instructor:{" "}
                {subjects?.teachers
                  ?.map((teacher) => teacher.firstname)
                  .join(" ")}{" "}
                {subjects?.teachers
                  ?.map((teacher) => teacher.lastname)
                  .join(" ")}
              </Text>
              <Text fontSize="lg" mb={2} fontWeight={"500"}>
                Email:{" "}
                {subjects?.teachers?.map((teacher) => teacher.email).join(" ")}
              </Text>
            </Box>
          </Box>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem
              w="100%"
              h="250px"
              bg="rgb(51, 51, 51)"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{
                bg: "rgba(51, 51, 51,0.9)",
                cursor: "pointer",
                boxShadow: "lg",
              }}
              boxShadow="md"
              onClick={() => navigate(`/create-room/${subject_id}`)}
              transition="all 0.3s ease"
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
              bg="rgb(51, 51, 51)"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{
                bg: "rgba(51, 51, 51,0.9)",
                cursor: "pointer",
                boxShadow: "lg",
              }}
              boxShadow="md"
              onClick={() => navigate(`/room-history/${subject_id}`)}
              transition="all 0.3s ease"
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
    </>
  );
};

export default SubjectDetail;
