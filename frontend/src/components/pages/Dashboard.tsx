import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Skeleton,
  Text,
  Image,
  Container,
  Stack,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getSubjectsByTid } from "../../services/api";
import { Subject } from "../../interface/ITeacherSubject";
import { useAuth } from "../../contexts/AuthContext";
import { ViewIcon, AddIcon } from "@chakra-ui/icons";

export default function Dashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const teacherId = user?.teacher_id || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const data = await getSubjectsByTid({ teacher_id: teacherId });
        setSubjects(data);
        console.log(data);
      } catch (error: any) {
        setError(
          error.message || "Failed to fetch subjects. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchSubjects();
    }
  }, [teacherId]);

  return (
    <Box p={4}>
      <Container
        maxW={{ base: "100%", md: "container.lg" }}
        className="no-copy-no-select"
        mt={6}
      >
        <Box
          height={90}
          border={"1px solid rgba(69, 69, 71,0.2)"}
          bg={"white"}
          mb={5}
          display={"flex"}
          alignItems={"center"}
          p={5}
        >
          <Text fontWeight={"bold"} fontSize={"1.5rem"}>
            Course Overview
          </Text>
        </Box>
        {loading ? (
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
        ) : error ? (
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
        ) : (
          <Grid
            bg={"white"}
            border={"1px solid rgba(69, 69, 71,0.2)"}
            p={7}
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {subjects.map(({ subject_id, subject_name, subject_pic }) => (
              <GridItem key={subject_id} w="100%">
                <Box
                  bg="white"
                  borderRadius="md"
                  shadow="xl"
                  _hover={{
                    shadow: "lg",
                    transform: "scale(1.05)",
                    backgroundColor: "#f0f0f0",
                  }}
                  transition="0.3s"
                >
                  <Image
                    src={subject_pic || "https://via.placeholder.com/150"}
                    alt={subject_name}
                    borderTopRadius="md"
                    height="150px"
                    width="100%"
                    objectFit="cover"
                  />
                  <Box p={4}>
                    <Text fontSize="lg" fontWeight="bold">
                      {subject_name}
                    </Text>
                    <Text mt={2}>รหัสวิชา: {subject_id}</Text>
                    <Box
                      mt={4}
                      borderTop="1px solid"
                      borderColor="gray.200"
                      pt={2}
                    >
                      <Stack direction="row" spacing={4} justify={"center"}>
                        <Button
                          leftIcon={<AddIcon />}
                          colorScheme="teal"
                          variant="solid"
                          onClick={() => navigate(`/create-room/${subject_id}`)}
                        >
                          Create
                        </Button>
                        <Button
                          rightIcon={<ViewIcon />}
                          colorScheme="teal"
                          variant="outline"
                          onClick={() =>
                            navigate(`/attendance/room/subject/${subject_id}`)
                          }
                        >
                          View
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </GridItem>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
