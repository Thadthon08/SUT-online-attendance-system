import {
  Box,
  CloseButton,
  Flex,
  Text,
  BoxProps,
  Skeleton,
  VStack,
  Divider,
  Button,
} from "@chakra-ui/react";
import { Avatar } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import { LuGraduationCap } from "react-icons/lu";
import { useEffect, useState } from "react";
import { getSubjectsByTid } from "../../services/api";
import { Subject } from "../../interface/ITeacherSubject";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps extends BoxProps {
  onClose: () => void;
  teacherId: string;
}

const SidebarContent = ({ onClose, teacherId, ...rest }: SidebarProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const userDataString = sessionStorage.getItem("user");
  let userData = { firstname: "", lastname: "", profile_pic: "" };
  if (userDataString) {
    try {
      userData = JSON.parse(userDataString);
    } catch (error) {
      console.error("Error parsing user data", error);
    }
  }

  const { firstname, lastname, profile_pic } = userData;

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

  return (
    <Box
      transition="3s ease"
      bg={"white"}
      boxShadow={{ base: "none", md: "xl" }}
      w={{ base: "full", md: "350px" }}
      pos="fixed"
      h="full"
      overflowY="auto"
      p={4}
      {...rest}
    >
      <Flex mt={6} justify={"center"} position={"relative"} left={"17px"}>
        <img
          src={window.location.origin + "/assets/SUT_logo_v_en_or.png"}
          alt="logo"
          width={120}
          className="cursor-pointer"
          onClick={() => navigate("/")}
        />
        <CloseButton
          display={{ base: "flex", md: "none" }}
          position={"absolute"}
          right={4}
          fontSize={"2xl"}
          outline={"none"}
          onClick={onClose}
        />
      </Flex>

      <VStack spacing={4} align="center">
        <Divider
          orientation="horizontal"
          my={5}
          borderWidth="1px"
          borderColor={"rgba(69, 69, 71,0.2)"}
        />

        <Avatar
          alt="Profile Picture"
          src={
            profile_pic && profile_pic.startsWith("http")
              ? profile_pic
              : "https://i.pinimg.com/474x/2e/f7/d0/2ef7d01dc60a235ffdb2069e024c0735.jpg"
          }
          size={100}
        />
        <Text
          fontWeight="bold"
          fontSize="lg"
          textAlign="center"
          mt={2}
          color="gray.800"
        >
          {firstname} {lastname}
        </Text>
        <Button leftIcon={<LogOut />} colorScheme="orange" onClick={signOut}>
          Logout
        </Button>
      </VStack>

      <Text
        fontWeight="bold"
        marginTop={8}
        marginLeft={4}
        marginBottom={5}
        fontSize="lg"
        letterSpacing="wider"
        color="#f26a2e"
      >
        COURSES
      </Text>

      {/* Courses List */}
      <VStack spacing={4} align="start" px={4}>
        {loading || error
          ? Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} height="20px" width="full" />
            ))
          : subjects.map((subject) => {
              const href = `/create-room/${subject.subject_id}`;
              const isActive = location.pathname.includes(
                `/create-room/${subject.subject_id}`
              );

              return (
                <NavItem
                  key={subject.subject_id}
                  fontSize="sm"
                  fontWeight="small"
                  icon={LuGraduationCap}
                  href={href}
                  bg={isActive ? "gray.800" : "transparent"}
                  transition="all 0.3s ease"
                  color={isActive ? "white" : "gray.800"} // Softened colors
                  _hover={{
                    bg: "gray.800",
                    color: "white",
                  }}
                >
                  {subject.subject_id} {subject.subject_name}
                </NavItem>
              );
            })}
      </VStack>
    </Box>
  );
};

export default SidebarContent;
