import CreateRoomForm from "../layout/CreateRoomForm";
import { Box, Container, Text } from "@chakra-ui/react";

export default function CreateRoom() {
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
          <Text fontWeight={"bold"} fontSize={{ base: "1.2rem", md: "1.4rem" }}>
            Create Attendance Check
          </Text>
        </Box>
        <Box border={"1px solid rgba(69, 69, 71,0.2)"} bg={"white"}>
          <CreateRoomForm />
        </Box>
      </Container>
    </Box>
  );
}
