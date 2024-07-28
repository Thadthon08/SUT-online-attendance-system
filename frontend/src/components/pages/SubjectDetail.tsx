import React from "react";
import { useParams } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react";

const SubjectDetail: React.FC = () => {
  const { subject_id } = useParams<{ subject_id: string }>();

  return (
    <>
      <Box p="4">
        <Text fontSize="2xl">Subject ID: {subject_id}</Text>
      </Box>
    </>
  );
};

export default SubjectDetail;
