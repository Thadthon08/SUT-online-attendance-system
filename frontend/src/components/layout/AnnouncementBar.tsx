import React from "react";
import { Alert } from "antd";
import Marquee from "react-fast-marquee";
import { Box, Flex } from "@chakra-ui/react";

const AnnouncementBar: React.FC = () => {
  return (
    <Alert
      message={
        <Flex alignItems="center" width="100%" p={1}>
          <Box
            p={3}
            borderWidth="1px"
            borderColor="gray.300"
            borderRadius="md"
            bg="black"
            color="white"
            fontWeight="bold"
            mr={1}
          >
            ประกาศ
          </Box>
          <Box flex="1" overflow="hidden">
            <Marquee gradient={false} speed={50} className="text-lg">
              I can be a React component, multiple React components, or just
              some text.
            </Marquee>
          </Box>
        </Flex>
      }
      type="warning"
    />
  );
};

export default AnnouncementBar;
