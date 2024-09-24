import { Box, Grid, GridItem, Text, Image, Container, Stack, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ViewIcon } from "@chakra-ui/icons";

export default function Tutorial() {
  const navigate = useNavigate();

  return (
    <Box p={4}>
      <Container
        maxW={{ base: "100%", md: "container.lg" }}
        className="no-copy-no-select"
        mt={6}
      >
        {/* Tutorial Header */}
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
            How to Log in via LINE Using QR Code
          </Text>
        </Box>

        {/* Tutorial Content */}
        <Box
          bg={"white"}
          border={"1px solid rgba(69, 69, 71,0.2)"}
          p={7}
          mb={6}
        >
          <Text fontSize="lg" mb={4}>
            Follow these steps to log in to your account via LINE using the QR code:
          </Text>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={6}
          >
            {/* Step 1 */}
            <GridItem>
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
                p={4}
              >
                <Image
                  src="https://via.placeholder.com/150"
                  alt="Open LINE App"
                  borderTopRadius="md"
                  height="150px"
                  width="100%"
                  objectFit="cover"
                />
                <Text fontSize="lg" fontWeight="bold" mt={3}>
                  Step 1: Open LINE App
                </Text>
                <Text mt={2}>
                  Open the LINE app on your phone and navigate to the QR code scanner by clicking the "+" icon in the top right corner.
                </Text>
              </Box>
            </GridItem>

            {/* Step 2 */}
            <GridItem>
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
                p={4}
              >
                <Image
                  src="https://via.placeholder.com/150"
                  alt="Scan QR Code"
                  borderTopRadius="md"
                  height="150px"
                  width="100%"
                  objectFit="cover"
                />
                <Text fontSize="lg" fontWeight="bold" mt={3}>
                  Step 2: Scan the QR Code
                </Text>
                <Text mt={2}>
                  Use the camera on the LINE app to scan the QR code presented on your login page.
                </Text>
              </Box>
            </GridItem>

            {/* Step 3 */}
            <GridItem>
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
                p={4}
              >
                <Image
                  src="https://via.placeholder.com/150"
                  alt="Confirm Login"
                  borderTopRadius="md"
                  height="150px"
                  width="100%"
                  objectFit="cover"
                />
                <Text fontSize="lg" fontWeight="bold" mt={3}>
                  Step 3: Confirm Login
                </Text>
                <Text mt={2}>
                  After scanning, confirm the login on your LINE app to securely access your account.
                </Text>
              </Box>
            </GridItem>
          </Grid>

          <Box mt={6} textAlign="center">
            <Button
              rightIcon={<ViewIcon />}
              colorScheme="teal"
              variant="solid"
              onClick={() => navigate("/login")}
            >
              Go to Login Page
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
