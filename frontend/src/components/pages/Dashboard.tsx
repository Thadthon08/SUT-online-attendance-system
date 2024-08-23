import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Skeleton,
  Alert,
  AlertIcon,
  Text,
  Image,
  Container,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getSubjectsByTid } from "../../services/api";
import { Subject } from "../../interface/ITeacherSubject";
import CarouselComponent from "../layout/Carousel";

export default function Dashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const teacherId = localStorage.getItem("teacher_id")?.replace(/"/g, "") || "";

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjectsByTid({ teacher_id: teacherId });
        setSubjects(data);
        console.log(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [teacherId]);

  return (
    <>
      <CarouselComponent />
      <Box p={4} mt={5}>
        <Container
          maxW={{ base: "100%", md: "container.lg" }}
          className="no-copy-no-select"
        >
          {loading || error ? (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={6}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <GridItem key={index}>
                  <Skeleton height="300px" />
                </GridItem>
              ))}
            </Grid>
          ) : (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={6}
            >
              {subjects.map(({ subject_id, subject_name, teachers }) => (
                <GridItem key={subject_id} w="100%">
                  <Link to={`/subject/${subject_id}`}>
                    <Box
                      bg="white"
                      borderRadius="md"
                      shadow="md"
                      _hover={{
                        shadow: "lg",
                        transform: "scale(1.05)",
                        backgroundColor: "#f0f0f0",
                      }}
                      transition="0.3s"
                    >
                      <Image
                        src="https://via.placeholder.com/300"
                        alt={subject_name}
                        borderTopRadius="md"
                        height="150px"
                        width="100%"
                        objectFit="cover"
                      />
                      <Box p={4}>
                        <Text fontSize="xl" fontWeight="bold">
                          {subject_name}
                        </Text>
                        <Text mt={2}>Subject ID: {subject_id}</Text>
                        <Box
                          mt={4}
                          borderTop="1px solid"
                          borderColor="gray.200"
                          pt={2}
                        >
                          {teachers && teachers.length > 0 ? (
                            teachers.map(
                              ({
                                teacher_id,
                                firstname,
                                lastname,
                                profile_pic,
                              }) => (
                                <Flex key={teacher_id} align="center" mt={2}>
                                  <Image
                                    borderRadius="full"
                                    boxSize="40px"
                                    src={
                                      profile_pic ||
                                      "https://via.placeholder.com/150"
                                    }
                                    alt={firstname}
                                    mr={4}
                                  />
                                  <Box>
                                    <Text fontSize="md" fontWeight="bold">
                                      {firstname} {lastname}
                                    </Text>
                                    <Text fontSize="sm">
                                      Teacher ID: {teacher_id}
                                    </Text>
                                  </Box>
                                </Flex>
                              )
                            )
                          ) : (
                            <Text fontSize="sm" color="gray.500">
                              No teachers assigned.
                            </Text>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Link>
                </GridItem>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
