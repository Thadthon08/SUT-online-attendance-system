import React from "react";
import { Alert } from "antd";
import Marquee from "react-fast-marquee";
import { Box, Flex } from "@chakra-ui/react";

const AnnouncementBar: React.FC = () => {
  return (
    <Alert
      className="no-copy-no-select"
      message={
        <Flex alignItems="center" width="100%" p={1}>
          <Box
            p={2}
            borderWidth="1px"
            borderColor="gray.300"
            borderRadius="md"
            bg="black"
            color="white"
            fontSize={["sm", "md"]}
            fontWeight="bold"
            mr={2}
          >
            ประกาศ
          </Box>
          <Box flex="1" overflow="hidden">
            <Marquee gradient={false} speed={50} className="text-lg">
              ขณะนี้ระบบเช็คชื่อออนไลน์กำลังอยู่ในช่วงการทดสอบ
              โปรดอดทนรอขณะระบบดำเนินการ ระบบอาจมีการเปลี่ยนแปลงข้อมูลได้
              ขอบคุณครับ/ค่ะ
            </Marquee>
          </Box>
        </Flex>
      }
      type="warning"
    />
  );
};

export default AnnouncementBar;
