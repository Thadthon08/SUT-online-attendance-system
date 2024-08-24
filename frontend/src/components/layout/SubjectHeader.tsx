import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { Subject } from "../../interface/ITeacherSubject";

interface SubjectHeaderProps {
  subjects: Subject | undefined;
  subject_id: string;
}

const SubjectHeader: React.FC<SubjectHeaderProps> = ({
  subjects,
  subject_id,
}) => {
  return (
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
            ?.map((teacher) => `${teacher.firstname} ${teacher.lastname}`)
            .join(", ") || "N/A"}
        </Text>
        <Text fontSize="lg" mb={2} fontWeight={"500"}>
          Email:{" "}
          {subjects?.teachers?.map((teacher) => teacher.email).join(" ") ||
            "N/A"}
        </Text>
      </Box>
    </Box>
  );
};

export default SubjectHeader;
