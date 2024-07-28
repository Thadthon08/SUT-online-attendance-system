import React, { useEffect, useState } from "react";
import {
  Box,
  CloseButton,
  Flex,
  Text,
  BoxProps,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import { LuGraduationCap } from "react-icons/lu";
import { getSubjectsByTid } from "../../services/api";
import { Subject } from "../../interface/ITeacherSubject";

interface SidebarProps extends BoxProps {
  onClose: () => void;
  teacherId: string;
}

const SidebarContent = ({ onClose, teacherId, ...rest }: SidebarProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjectsByTid({ teacher_id: teacherId });
        setSubjects(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [teacherId]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box
      transition="3s ease"
      bg={"white"}
      borderRight="1px"
      borderRightColor={"gray.200"}
      w={{ base: "full", md: 80 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          SUT Attendence
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {subjects.map((subject) => (
        <NavItem
          key={subject.subject_id}
          icon={LuGraduationCap}
          href={`/subject/?subject_id=${subject.subject_id}`}
          _active={
            location.pathname + location.search ===
            `/subject/?subject_id=${subject.subject_id}`
              ? "active"
              : ""
          }
        >
          {subject.subject_id} {subject.subject_name}
        </NavItem>
      ))}
    </Box>
  );
};

export default SidebarContent;
