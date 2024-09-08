import {  Heading, Text, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      textAlign="center"
      py={10}
      px={6}
    >
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, rgba(242, 101, 34,400), rgb(242, 101, 34,600))"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you're looking for does not seem to exist
      </Text>
      <Button
        colorScheme="blackAlpha"
        bgGradient="linear(to-r, rgba(242, 101, 34,400),rgba(242, 101, 34,500), rgb(242, 101, 34,600))"
        color="white"
        variant="solid"
        onClick={() => navigate("/")}
      >
        Go to Home
      </Button>
    </Flex>
  );
}

export default PageNotFound;
